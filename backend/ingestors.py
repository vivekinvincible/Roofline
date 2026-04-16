import json


class ListingIngestor:
    def __init__(self, storage):
        self.storage = storage

    def ingest_file(self, file_path: str, adapter):
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)

            # Determine if the data is a single object or a list
            if isinstance(data, list):
                items = data
            elif isinstance(data, dict):
                # Search for common list keys in raw exports
                items = data.get("items") or data.get(
                    "listings") or data.get("results")
                # If it's a single Idealista-style object without a wrapper
                if items is None and "propertyId" in data:
                    items = [data]
            else:
                items = None

            if not items:
                print(
                    f"⚠️ No valid items found in {file_path}. Check JSON structure.")
                return

            print(f"✅ Processing {len(items)} items from {file_path}...")

            success_count = 0
            for raw_item in items:
                try:
                    clean_property = adapter.map(raw_item)

                    # Ensure we don't save None and that we have a minimum required ID
                    if clean_property and clean_property.external_id:
                        self.storage.save(clean_property)
                        success_count += 1
                except Exception as map_err:
                    print(f"  ❌ Skipping item due to mapping error: {map_err}")

            print(f"🚀 Ingestion finished: {success_count}/{len(items)} saved.")

        except Exception as e:
            print(f"❌ Critical error during ingestion of {file_path}: {e}")
