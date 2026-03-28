import random

class ExternalAPIs:
    @staticmethod
    def get_traffic_data(location: str = "Silk Board, Bengaluru"):
        # Randomized for demo simulation
        # High traffic density near Silk Board is a common Bengaluru meme
        return {
            "density": "95%",
            "closures": ["Outer Ring Road East segment blocked", "Service lane congested"],
            "impact_delay": "15 mins",
            "suggested_bypasses": ["Sarjapur-HSR flyover"]
        }

    @staticmethod
    def get_weather_data(location: str = "Bengaluru"):
        return {
            "conditions": "Intermittent light drizzle",
            "visibility": "Moderate (6km)",
            "temp": "24°C"
        }
