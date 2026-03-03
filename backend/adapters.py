import datetime
from models import Property, AreaUnit


class IdealistaAdapter:
    @staticmethod
    def map(item: dict) -> Property:
        loc = item.get("location", {})
        trans = item.get("transaction", {})
        multimedia = item.get("multimedia", [])

        # Extract specific media
        video = next((m.get("url")
                     for m in multimedia if m.get("type") == "21"), None)
        image = next((m.get("url")
                     for m in multimedia if m.get("type") == "2"), None)

        return Property(
            external_id=f"idealista_{item.get('propertyId')}",
            source="idealista",
            title=f"Property in {loc.get('level5Name')}",
            description=item.get("description"),
            price=trans.get("price"),
            currency="EUR",
            area=item.get("surface"),
            area_unit=AreaUnit.SQM,
            rooms=item.get("rooms"),
            bathrooms=item.get("baths"),
            country_code="ES",
            location_city=loc.get("level5Name"),
            location_province=loc.get("level2Name"),
            address=f"{item.get('street', '')} {item.get('number', '')}".strip(
            ),
            zip_code=item.get("zipCode"),
            latitude=float(loc.get("latitude")) if loc.get(
                "latitude") else None,
            longitude=float(loc.get("longitude")) if loc.get(
                "longitude") else None,
            image_url=image,
            video_url=video,
            agency_name=item.get("agency", {}).get("name")
        )


class DaftAdapter:
    @staticmethod
    def map(item: dict) -> Property:
        listing = item.get("listing", {})
        point = listing.get("point", {}).get("coordinates", [None, None])

        return Property(
            external_id=f"daft_{listing.get('id')}",
            source="daft",
            title=listing.get("title"),
            price=float(listing.get("price", "0").replace(
                "€", "").replace(",", "").split()[0]),
            currency="EUR",
            area=listing.get("floorArea", {}).get("value"),
            rooms=listing.get("bedrooms"),
            bathrooms=listing.get("bathrooms"),
            country_code="IE",
            location_city=listing.get("county", [None])[0],
            latitude=point[1],
            longitude=point[0],
            source_url=f"https://www.daft.ie{listing.get('seoFriendlyPath')}",
            image_url=listing.get("media", {}).get(
                "images", [{}])[0].get("url")
        )
