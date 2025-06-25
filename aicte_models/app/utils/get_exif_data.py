import requests
from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS
from io import BytesIO

def get_exif_data(image):
    # Extract EXIF data
    exif_data = image._getexif()
    if not exif_data:
        return None

    # Decode EXIF data
    exif = {}
    for tag, value in exif_data.items():
        tag_name = TAGS.get(tag, tag)
        if tag_name == "GPSInfo":
            gps_data = {}
            for gps_tag in value:
                gps_tag_name = GPSTAGS.get(gps_tag, gps_tag)
                gps_data[gps_tag_name] = value[gps_tag]
            exif[tag_name] = gps_data
        else:
            exif[tag_name] = value
    return exif

def get_geotags(gps_info):
    if not gps_info:
        return None

    def to_degrees(value):
        # Convert GPS coordinates to degrees
        d, m, s = value[0], value[1], value[2]
        return d + (m / 60.0) + (s / 3600.0)

    lat = gps_info.get("GPSLatitude")
    lat_ref = gps_info.get("GPSLatitudeRef")
    lon = gps_info.get("GPSLongitude")
    lon_ref = gps_info.get("GPSLongitudeRef")

    if lat and lon and lat_ref and lon_ref:
        latitude = to_degrees(lat)
        longitude = to_degrees(lon)

        if lat_ref != "N":
            latitude = -latitude
        if lon_ref != "E":
            longitude = -longitude

        return latitude, longitude
    return None

def extract_metadata_from_url(image_url):
    # Download the image
    response = requests.get(image_url)
    if response.status_code == 200:
        image = Image.open(BytesIO(response.content))
        exif_data = get_exif_data(image)
        if not exif_data:
            return "No EXIF data found."

        # Extract GPS info
        gps_info = exif_data.get("GPSInfo")
        geotags = get_geotags(gps_info)

        # Extract capture time
        capture_time = exif_data.get("DateTimeOriginal")

        return {"location": geotags, "capture_time": capture_time}
    else:
        return "Failed to fetch the image."

# Example usage
