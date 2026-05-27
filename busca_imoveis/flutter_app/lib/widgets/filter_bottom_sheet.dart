import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/search_provider.dart';

class FilterBottomSheet extends StatefulWidget {
  const FilterBottomSheet({super.key});

  @override
  State<FilterBottomSheet> createState() => _FilterBottomSheetState();
}

class _FilterBottomSheetState extends State<FilterBottomSheet> {
  final List<String> _types = ['Todos', 'Apartamento', 'Casa', 'Chalé', 'Studio', 'Cobertura'];

  @override
  Widget build(BuildContext context) {
    // context.watch — o framework gerencia a reatividade (IoC)
    final provider = context.watch<SearchProvider>();

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: const BoxDecoration(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        color: Colors.white,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Handle
          Center(
            child: Container(
              width: 40, height: 4,
              decoration: BoxDecoration(color: Colors.grey[300], borderRadius: BorderRadius.circular(2)),
            ),
          ),
          const SizedBox(height: 16),
          const Text('Filtros', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 20),

          // Tipo de imóvel
          const Text('Tipo de imóvel', style: TextStyle(fontWeight: FontWeight.w600)),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            children: _types.map((type) => ChoiceChip(
              label: Text(type),
              selected: provider.selectedType == type,
              onSelected: (_) => context.read<SearchProvider>().setType(type),
              selectedColor: Colors.blue[100],
            )).toList(),
          ),
          const SizedBox(height: 16),

          // Preço máximo
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Preço máximo por noite', style: TextStyle(fontWeight: FontWeight.w600)),
              Text('R\$ ${provider.maxPrice.toStringAsFixed(0)}', style: const TextStyle(color: Colors.blue)),
            ],
          ),
          Slider(
            value: provider.maxPrice,
            min: 100,
            max: 1000,
            divisions: 18,
            onChanged: (v) => context.read<SearchProvider>().setMaxPrice(v),
            onChangeEnd: (_) => context.read<SearchProvider>().applyFilters(),
          ),
          const SizedBox(height: 8),

          // Número mínimo de hóspedes
          const Text('Número mínimo de hóspedes', style: TextStyle(fontWeight: FontWeight.w600)),
          const SizedBox(height: 8),
          Row(
            children: [1, 2, 4, 6, 8, 10].map((n) => Padding(
              padding: const EdgeInsets.only(right: 8),
              child: ChoiceChip(
                label: Text('$n+'),
                selected: provider.minGuests == n,
                onSelected: (_) => context.read<SearchProvider>().setMinGuests(n),
                selectedColor: Colors.blue[100],
              ),
            )).toList(),
          ),
          const SizedBox(height: 16),

          // Avaliação mínima
          const Text('Avaliação mínima', style: TextStyle(fontWeight: FontWeight.w600)),
          const SizedBox(height: 8),
          Row(
            children: [0, 4.0, 4.5, 4.8].map((r) => Padding(
              padding: const EdgeInsets.only(right: 8),
              child: ChoiceChip(
                label: Text(r == 0 ? 'Qualquer' : '$r+'),
                selected: provider.minRating == r,
                onSelected: (_) => context.read<SearchProvider>().setMinRating(r.toDouble()),
                selectedColor: Colors.blue[100],
              ),
            )).toList(),
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.blue,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              onPressed: () => Navigator.pop(context),
              child: const Text('Aplicar filtros', style: TextStyle(fontSize: 16)),
            ),
          ),
          const SizedBox(height: 8),
        ],
      ),
    );
  }
}
