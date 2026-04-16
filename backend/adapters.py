import datetime
import re
from models import Property, AreaUnit


class BaseAdapter:
    @staticmethod
    def _safe_float(value, default=0.0):
        try:
            if value is None:
                return default
            # Handle cases like "1.2M" or strings with commas
            clean_val = str(value).replace(',', '').replace('€', '').strip()
            return float(clean_val)
        except (ValueError, TypeError):
            return default

    @staticmethod
    def _safe_int(value, default=0):
        if value is None:
            return default
        try:
            # Extract only digits from strings like "4 Bed" or "5 Bath"
            if isinstance(value, str):
                numbers = re.findall(r'\d+', value)
                if numbers:
                    return int(numbers[0])
            return int(value)
        except (ValueError, TypeError):
            return default


class IdealistaAdapter(BaseAdapter):
    @staticmethod
    def map(item: dict) -> Property:
        if not item:
            return None

        loc = item.get("location", {})
        trans = item.get("transaction", {})
        # Handle if multimedia is None
        multimedia = item.get("multimedia") or []

        # Safe extraction of media
        video = next((m.get("url") for m in multimedia if isinstance(
            m, dict) and m.get("type") == "21"), None)
        image = next((m.get("url") for m in multimedia if isinstance(
            m, dict) and m.get("type") == "2"), None)

        city = loc.get('level5Name') or "Unknown City"

        return Property(
            external_id=f"idealista_{item.get('propertyId')}",
            source="idealista",
            title=f"Property in {city}",
            description=item.get("description") or "",
            price=IdealistaAdapter._safe_float(trans.get("price")),
            currency="EUR",
            area=IdealistaAdapter._safe_float(item.get("surface")),
            area_unit=AreaUnit.SQM,
            rooms=IdealistaAdapter._safe_int(item.get("rooms")),
            bathrooms=IdealistaAdapter._safe_int(item.get("baths")),
            country_code="ES",
            location_city=city,
            location_province=loc.get("level2Name"),
            address=f"{item.get('street', '')} {item.get('number', '')}".strip(
            ) or "Address Not Provided",
            zip_code=item.get("zipCode"),
            latitude=IdealistaAdapter._safe_float(loc.get("latitude"), None),
            longitude=IdealistaAdapter._safe_float(loc.get("longitude"), None),
            image_url=image,
            video_url=video,
            agency_name=item.get("agency", {}).get(
                "name") if item.get("agency") else "Private Seller"
        )


class DaftAdapter(BaseAdapter):
    @staticmethod
    def map(item: dict) -> Property:
        if not item:
            return None

        listing = item.get("listing", {})

        # 1. Coordinate Parsing
        point = listing.get("point", {}).get("coordinates", [None, None])

        # 2. Multimedia Parsing (Looking for size720x480 per your JSON)
        media_obj = listing.get("media", {})
        images_list = media_obj.get("images", [])
        image_url = None
        if images_list and isinstance(images_list, list):
            # Prefer the large size from your JSON, fallback to standard 'url'
            image_url = images_list[0].get(
                "size720x480") or images_list[0].get("url")

        # 3. Price Cleaning (Handles "€1,200,000")
        raw_price = str(listing.get("price", "0"))
        clean_price = "".join(filter(str.isdigit, raw_price))

        return Property(
            external_id=f"daft_{listing.get('id')}",
            source="daft",
            title=listing.get("title") or "Daft Property",
            # Using seoTitle as backup description
            description=listing.get("seoTitle"),
            price=DaftAdapter._safe_float(clean_price),
            currency="EUR",
            # Correcting mapping for Daft schema
            area=DaftAdapter._safe_float(
                listing.get("floorArea", {}).get("value")),
            # Fix: numBedrooms instead of bedrooms
            rooms=DaftAdapter._safe_int(listing.get("numBedrooms")),
            # Fix: numBathrooms instead of bathrooms
            bathrooms=DaftAdapter._safe_int(listing.get("numBathrooms")),
            property_type=listing.get("propertyType", "house").lower(),
            country_code="IE",
            location_city=listing.get("county", ["Ireland"])[
                0] if listing.get("county") else "Ireland",
            latitude=DaftAdapter._safe_float(
                point[1], None) if len(point) > 1 else None,
            longitude=DaftAdapter._safe_float(
                point[0], None) if len(point) > 0 else None,
            source_url=f"https://www.daft.ie{listing.get('seoFriendlyPath', '')}",
            image_url=image_url,
            agency_name=listing.get("seller", {}).get("name") or "Daft Agent"
        )
