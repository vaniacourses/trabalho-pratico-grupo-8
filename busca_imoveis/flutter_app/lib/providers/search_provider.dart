import 'package:flutter/foundation.dart';
import '../models/property.dart';
import '../services/property_service.dart';

// ============================================================
// SearchProvider é a camada de estado/lógica de negócio.
// Ele NÃO é instanciado pela tela — o Provider (framework)
// o injeta via ChangeNotifierProvider na árvore de widgets.
//
// A tela apenas CONSOME o estado via context.watch<SearchProvider>().
// O framework decide quando notificar os widgets dependentes.
// ============================================================
class SearchProvider extends ChangeNotifier {
  // Dependência injetada via construtor (não instanciada aqui)
  final PropertyService _service;

  SearchProvider(this._service);

  // Estado interno
  List<Property> _results = [];
  bool _isLoading = false;
  String _query = '';
  String _selectedType = 'Todos';
  double _maxPrice = 1000;
  int _minGuests = 1;
  double _minRating = 0;

  // Getters expostos para a UI
  List<Property> get results => _results;
  bool get isLoading => _isLoading;
  String get query => _query;
  String get selectedType => _selectedType;
  double get maxPrice => _maxPrice;
  int get minGuests => _minGuests;
  double get minRating => _minRating;

  // O framework chama notifyListeners() e reconstrói apenas
  // os widgets que dependem desse Provider — IoC no rebuild
  Future<void> search() async {
    _isLoading = true;
    notifyListeners(); // framework reage e reconstrói a UI

    _results = await _service.search(
      query: _query,
      type: _selectedType,
      maxPrice: _maxPrice,
      minGuests: _minGuests,
      minRating: _minRating == 0 ? null : _minRating,
    );

    _isLoading = false;
    notifyListeners();
  }

  void setQuery(String value) {
    _query = value;
    search();
  }

  void setType(String value) {
    _selectedType = value;
    search();
  }

  void setMaxPrice(double value) {
    _maxPrice = value;
    notifyListeners();
  }

  void setMinGuests(int value) {
    _minGuests = value;
    search();
  }

  void setMinRating(double value) {
    _minRating = value;
    search();
  }

  void applyFilters() => search();
}
