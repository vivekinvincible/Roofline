from sqlmodel import Session, select
from models import Property


class PropertyStorage:
    def __init__(self, session: Session):
        self.session = session

    def save(self, property_data: Property):
        # Check if property already exists via external_id
        statement = select(Property).where(
            Property.external_id == property_data.external_id)
        existing = self.session.exec(statement).first()

        if existing:
            # Update existing fields
            for key, value in property_data.model_dump(exclude={"id"}).items():
                setattr(existing, key, value)
        else:
            # Add new record
            self.session.add(property_data)

        try:
            self.session.commit()
            return True
        except Exception as e:
            self.session.rollback()
            print(f"Error saving property: {e}")
            return False
