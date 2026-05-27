import '../models/property.dart';

// Camada de serviço — a UI não a instancia diretamente.
// O Provider (framework) injeta essa dependência onde necessário.
// A UI não controla "como" buscar, apenas "pede" o resultado. IoC
class PropertyService {
  // Dados mockados
  final List<Property> _mockProperties = const [
    Property(
      id: '1',
      title: 'Apartamento moderno no centro',
      location: 'Rio de Janeiro, RJ',
      pricePerNight: 280,
      rating: 4.8,
      maxGuests: 4,
      type: 'Apartamento',
      amenities: ['Wi-Fi', 'Ar-condicionado', 'Cozinha', 'Estacionamento'],
      imageUrl: 'https://picsum.photos/seed/apt1/400/300',
    ),
    Property(
      id: '2',
      title: 'Casa de praia com vista para o mar',
      location: 'Búzios, RJ',
      pricePerNight: 520,
      rating: 4.9,
      maxGuests: 8,
      type: 'Casa',
      amenities: ['Wi-Fi', 'Piscina', 'Churrasqueira', 'Cozinha', 'Estacionamento'],
      imageUrl: 'https://picsum.photos/seed/beach1/400/300',
    ),
    Property(
      id: '3',
      title: 'Chalé aconchegante na serra',
      location: 'Petrópolis, RJ',
      pricePerNight: 350,
      rating: 4.7,
      maxGuests: 6,
      type: 'Chalé',
      amenities: ['Wi-Fi', 'Lareira', 'Cozinha', 'Jardim'],
      imageUrl: 'https://picsum.photos/seed/chale1/400/300',
    ),
    Property(
      id: '4',
      title: 'Studio compacto perto da praia',
      location: 'Niterói, RJ',
      pricePerNight: 160,
      rating: 4.5,
      maxGuests: 2,
      type: 'Studio',
      amenities: ['Wi-Fi', 'Ar-condicionado', 'Cozinha'],
      imageUrl: 'https://picsum.photos/seed/studio1/400/300',
    ),
    Property(
      id: '5',
      title: 'Cobertura com terraço e vista panorâmica',
      location: 'São Paulo, SP',
      pricePerNight: 750,
      rating: 5.0,
      maxGuests: 6,
      type: 'Cobertura',
      amenities: ['Wi-Fi', 'Piscina', 'Academia', 'Ar-condicionado', 'Estacionamento'],
      imageUrl: 'https://picsum.photos/seed/cob1/400/300',
    ),
    Property(
      id: '6',
      title: 'Casa de campo com piscina',
      location: 'Campos do Jordão, SP',
      pricePerNight: 430,
      rating: 4.6,
      maxGuests: 10,
      type: 'Casa',
      amenities: ['Wi-Fi', 'Piscina', 'Churrasqueira', 'Jardim', 'Estacionamento'],
      imageUrl: 'https://picsum.photos/seed/farm1/400/300',
    ),
  ];

  // Método de busca — recebe filtros e retorna lista filtrada
  Future<List<Property>> search({
    String query = '',
    String? type,
    double? maxPrice,
    int? minGuests,
    double? minRating,
  }) async {
    // Simula latência de rede
    await Future.delayed(const Duration(milliseconds: 600));

    return _mockProperties.where((p) {
      final matchesQuery = query.isEmpty ||
          p.title.toLowerCase().contains(query.toLowerCase()) ||
          p.location.toLowerCase().contains(query.toLowerCase());

      final matchesType = type == null || type == 'Todos' || p.type == type;
      final matchesPrice = maxPrice == null || p.pricePerNight <= maxPrice;
      final matchesGuests = minGuests == null || p.maxGuests >= minGuests;
      final matchesRating = minRating == null || p.rating >= minRating;

      return matchesQuery && matchesType && matchesPrice && matchesGuests && matchesRating;
    }).toList();
  }
}
