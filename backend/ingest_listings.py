import os
from typing import Dict, Any, Type
from dotenv import load_dotenv
from apify_client import ApifyClient
from sqlmodel import Session, create_engine, select

# Internal imports - ensure these match your file structure
from models import Property, PropertyType, AreaUnit
from database import DATABASE_URL

# Load environment variables from .env file
load_dotenv()

# 1. Base Adapter Interface


class BaseListingAdapter:
    @staticmethod
    def map(item: Dict[str, Any]) -> Property:
        raise NotImplementedError

# 2. Ireland Adapter (Daft.ie)


# 2. UPDATED Ireland Adapter (Blagoysimandoff Scraper)
class DaftIEAdapter(BaseListingAdapter):
    @staticmethod
    def map(item: Dict[str, Any]) -> Property:
        return Property(
            title=item.get("title", "Unknown Title"),
            property_type=PropertyType.APARTMENT if "apartment" in str(
                item.get("category", "")).lower() else PropertyType.HOUSE,
            price=float(item.get("price", {}).get("amount", 0)) if isinstance(
                item.get("price"), dict) else float(item.get("price", 0)),
            currency="EUR",
            area=float(item.get("floorArea", 0) or 0),
            area_unit=AreaUnit.SQM,
            country_code="IE",
            location_city=item.get("location", {}).get("areaName", "Dublin"),
            latitude=item.get("location", {}).get(
                "coordinates", {}).get("lat"),
            longitude=item.get("location", {}).get(
                "coordinates", {}).get("lon")
        )

# 3. UPDATED Spain Adapter (Datacut Scraper)


class IdealistaESAdapter(BaseListingAdapter):
    @staticmethod
    def map(item: Dict[str, Any]) -> Property:
        return Property(
            title=item.get("title", "Idealista Listing"),
            property_type=PropertyType.VILLA if "chalet" in str(
                item.get("propertyType", "")).lower() else PropertyType.APARTMENT,
            price=float(item.get("price", 0)),
            currency="EUR",
            area=float(item.get("sizeM2") or 0),
            area_unit=AreaUnit.SQM,
            country_code="ES",
            location_city=item.get("city", "Madrid"),
            latitude=item.get("latitude"),
            longitude=item.get("longitude")
        )

# 4. The Orchestrator


class ListingIngestor:
    def __init__(self):
        token = os.getenv("APIFY_TOKEN")
        if not token:
            raise ValueError(
                "❌ APIFY_TOKEN not found in environment variables. Check your .env file.")

        self.client = ApifyClient(token)
        self.engine = create_engine(DATABASE_URL)

    def fetch_and_store(self, actor_id: str, run_input: Dict, adapter: Type[BaseListingAdapter]):
        print(f"🚀 Starting Scraper Actor: {actor_id}")

        try:
            # Call Apify Actor
            run = self.client.actor(actor_id).call(run_input=run_input)
            items = self.client.dataset(
                run["defaultDatasetId"]).list_items().items
            print(
                f"✅ Fetched {len(items)} items from Apify. Processing mapping...")

            with Session(self.engine) as session:
                new_count = 0
                for raw_item in items:
                    try:
                        # Map raw JSON to our SQLModel
                        property_obj = adapter.map(raw_item)

                        # Prevent duplicates: Check if title + price + country exists
                        existing = session.exec(
                            select(Property).where(
                                Property.title == property_obj.title,
                                Property.price == property_obj.price,
                                Property.country_code == property_obj.country_code
                            )
                        ).first()

                        if not existing:
                            session.add(property_obj)
                            new_count += 1
                    except Exception as e:
                        print(f"⚠️ Skipping item due to mapping error: {e}")

                session.commit()
                print(f"💾 Storage Complete. Added {new_count} new properties.")

        except Exception as e:
            print(f"🔥 Critical error during ingest: {e}")


# Updated Execution Logic in ingest_listings.py

if __name__ == "__main__":
    ingestor = ListingIngestor()

    # 🇮🇪 Ireland Fix: Use Residential Proxies to solve Cloudflare
    print("Trying Ireland with Residential Proxies...")
    ingestor.fetch_and_store(
        actor_id="blagoysimandoff/daft-property-scraper",
        run_input={
            "searchTerm": "Dublin",
            "maxProperties": 2,  # Keep it tiny to save credits during testing
            "proxyConfiguration": {
                "useApifyProxy": True,
                "apifyProxyGroups": ["RESIDENTIAL"]
            }
        },
        adapter=DaftIEAdapter
    )

    # 🇪🇸 Spain Fix: Use Spain-specific Residential Proxies to bypass 403
    print("\nTrying Spain with ES-Geolocated Residential Proxies...")
    ingestor.fetch_and_store(
        actor_id="datacut/idealista-scraper",
        run_input={
            "location": "Madrid",
            "maxItems": 2,
            "proxyConfiguration": {
                "useApifyProxy": True,
                "apifyProxyGroups": ["RESIDENTIAL"],
                "apifyProxyCountryCode": "ES"  # Crucial for Idealista
            }
        },
        adapter=IdealistaESAdapter
    )
