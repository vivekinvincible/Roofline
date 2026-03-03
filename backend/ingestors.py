import json


class ListingIngestor:
    def __init__(self, storage):
        self.storage = storage

    def ingest_file(self, file_path: str, adapter):
        try:
            # All these lines are now indented 4 spaces relative to 'try'
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)

            print(f"DEBUG: Loaded {file_path}. Type: {type(data)}")

            # Handle different JSON formats
            if isinstance(data, list):
                items = data
            elif isinstance(data, dict):
                items = data.get("items") or data.get(
                    "listings") or data.get("results")
            else:
                items = None

            if not items:
                print(f"⚠️ No items list found in {file_path}.")
                return

            print(f"✅ Found {len(items)} items in {file_path}. Mapping...")
            for raw_item in items:
                clean_property = adapter.map(raw_item)
                self.storage.save(clean_property)

        except Exception as e:
            # The 'except' must be at the same level as the 'try'
            print(f"❌ Error during ingestion of {file_path}: {e}")
