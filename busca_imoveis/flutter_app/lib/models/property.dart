class Property {
  final String id;
  final String title;
  final String location;
  final double pricePerNight;
  final double rating;
  final int maxGuests;
  final String type;
  final List<String> amenities;
  final String imageUrl;

  const Property({
    required this.id,
    required this.title,
    required this.location,
    required this.pricePerNight,
    required this.rating,
    required this.maxGuests,
    required this.type,
    required this.amenities,
    required this.imageUrl,
  });
}
