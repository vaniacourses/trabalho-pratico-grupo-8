import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/search_provider.dart';
import '../widgets/property_card.dart';
import '../widgets/filter_bottom_sheet.dart';

// ============================================================
// SearchScreen é apenas a CAMADA DE APRESENTAÇÃO.
// Ela não sabe como buscar imóveis, não instancia serviços,
// não controla o estado — tudo isso é responsabilidade do
// SearchProvider, injetado pelo framework via Provider.
//
// A tela apenas:
//   1. Lê o estado via context.watch<SearchProvider>()
//   2. Dispara ações via context.read<SearchProvider>().método()
//   3. Renderiza o que o framework mandar reconstruir
// ============================================================
class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    // initState é chamado pelo FRAMEWORK quando o widget é inserido na árvore
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<SearchProvider>().search();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    // dispose também é invocado pelo framework ao remover o widget
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // context.watch registra este widget como dependente do SearchProvider
    // Quando o provider chamar notifyListeners(), o framework reconstrói este widget
    final provider = context.watch<SearchProvider>();

    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: const Text(
          'Encontrar Imóvel',
          style: TextStyle(color: Colors.black87, fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.tune, color: Colors.black87),
            onPressed: () => showModalBottomSheet(
              context: context,
              isScrollControlled: true,
              shape: const RoundedRectangleBorder(
                borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
              ),
              builder: (_) => const FilterBottomSheet(),
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          // Barra de busca
          Container(
            color: Colors.white,
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
            child: TextField(
              controller: _searchController,
              onChanged: (value) => context.read<SearchProvider>().setQuery(value),
              decoration: InputDecoration(
                hintText: 'Buscar por cidade, bairro ou nome...',
                prefixIcon: const Icon(Icons.search, color: Colors.grey),
                suffixIcon: _searchController.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear, color: Colors.grey),
                        onPressed: () {
                          _searchController.clear();
                          context.read<SearchProvider>().setQuery('');
                        },
                      )
                    : null,
                filled: true,
                fillColor: Colors.grey[100],
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                contentPadding: const EdgeInsets.symmetric(vertical: 12),
              ),
            ),
          ),

          // Filtros ativos (chips)
          if (provider.selectedType != 'Todos' || provider.minRating > 0)
            Container(
              color: Colors.white,
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
              child: Row(
                children: [
                  if (provider.selectedType != 'Todos')
                    Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: Chip(
                        label: Text(provider.selectedType),
                        backgroundColor: Colors.blue[50],
                        deleteIcon: const Icon(Icons.close, size: 16),
                        onDeleted: () => context.read<SearchProvider>().setType('Todos'),
                      ),
                    ),
                  if (provider.minRating > 0)
                    Chip(
                      label: Text('${provider.minRating}+ ★'),
                      backgroundColor: Colors.amber[50],
                      deleteIcon: const Icon(Icons.close, size: 16),
                      onDeleted: () => context.read<SearchProvider>().setMinRating(0),
                    ),
                ],
              ),
            ),

          // Contador de resultados
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
            child: Row(
              children: [
                Text(
                  provider.isLoading
                      ? 'Buscando...'
                      : '${provider.results.length} imóvel(is) encontrado(s)',
                  style: TextStyle(color: Colors.grey[600], fontSize: 13),
                ),
              ],
            ),
          ),

          // Lista de resultados
          Expanded(
            child: provider.isLoading
                ? const Center(child: CircularProgressIndicator())
                : provider.results.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.search_off, size: 64, color: Colors.grey[400]),
                            const SizedBox(height: 16),
                            Text(
                              'Nenhum imóvel encontrado',
                              style: TextStyle(color: Colors.grey[600], fontSize: 16),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'Tente ajustar os filtros',
                              style: TextStyle(color: Colors.grey[400], fontSize: 13),
                            ),
                          ],
                        ),
                      )
                    : ListView.builder(
                        itemCount: provider.results.length,
                        padding: const EdgeInsets.only(bottom: 16),
                        // ListView.builder é controlado pelo framework —
                        // ele decide quando construir cada item (lazy rendering)
                        itemBuilder: (context, index) => PropertyCard(
                          property: provider.results[index],
                        ),
                      ),
          ),
        ],
      ),
    );
  }
}
