from sqlalchemy import Column, String, Integer, Numeric, Text, ForeignKey, DateTime
from sqlalchemy.orm import declarative_base, relationship
from geoalchemy2 import Geometry

Base = declarative_base()

class H3TodAnalytics(Base):
    __tablename__ = "h3_tod_analytics"

    h3_index = Column(String(15), primary_key=True)
    resolution = Column(Integer, nullable=False, default=9)
    station_cluster = Column(String(50), nullable=False)
    density_score = Column(Numeric(5, 2), nullable=False)
    diversity_score = Column(Numeric(5, 2), nullable=False)
    design_score = Column(Numeric(5, 2), nullable=False)
    destination_score = Column(Numeric(5, 2), nullable=False)
    distance_score = Column(Numeric(5, 2), nullable=False)
    tod_readiness_score = Column(Numeric(5, 2), nullable=False)
    typology = Column(String(50), nullable=False)
    njop_m2 = Column(Numeric(12, 2))
    predicted_njop_premium_pct = Column(Numeric(5, 2))
    ci_lower_pct = Column(Numeric(5, 2))
    ci_upper_pct = Column(Numeric(5, 2))
    geom = Column(Geometry(geometry_type='POLYGON', srid=4326), nullable=False)

    survey_points = relationship("SurveyPoint", back_populates="h3_analytics")


class Station(Base):
    __tablename__ = "stations"

    id = Column(String(50), primary_key=True)
    name = Column(String(100), nullable=False)
    latitude = Column(Numeric(9, 6), nullable=False)
    longitude = Column(Numeric(9, 6), nullable=False)
    tod_readiness_score = Column(Numeric(5, 2), nullable=False)
    density_score = Column(Numeric(5, 2), nullable=False)
    diversity_score = Column(Numeric(5, 2), nullable=False)
    design_score = Column(Numeric(5, 2), nullable=False)
    destination_score = Column(Numeric(5, 2), nullable=False)
    distance_score = Column(Numeric(5, 2), nullable=False)
    typology = Column(String(50), nullable=False)
    weakest_dimension = Column(String(50), nullable=False)
    strongest_dimension = Column(String(50), nullable=False)
    geom = Column(Geometry(geometry_type='POINT', srid=4326), nullable=False)


class SurveyPoint(Base):
    __tablename__ = "survey_points"

    id = Column(String(50), primary_key=True)
    category = Column(String(50), nullable=False)
    survey_type = Column(String(20), nullable=False)
    mission_subtype = Column(String(30))
    name = Column(String(255), nullable=False)
    description = Column(Text)
    photo_url = Column(Text)
    condition = Column(String(100))
    spending_amount = Column(Numeric(12, 2))
    menu_price_range = Column(String(50))
    property_price = Column(Numeric(15, 2))
    transaction_type = Column(String(20))
    h3_index = Column(String(15), ForeignKey("h3_tod_analytics.h3_index"))
    surveyed_at = Column(DateTime(timezone=True))
    geom = Column(Geometry(geometry_type='POINT', srid=4326), nullable=False)

    h3_analytics = relationship("H3TodAnalytics", back_populates="survey_points")
