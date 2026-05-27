import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/search_provider.dart';
import 'services/property_service.dart';
import 'screens/search_screen.dart';

void main() {
  runApp(const MyApp());
}

// ============================================================
// PONTO DE ENTRADA — Configuração da Inversão de Controle
//
// ChangeNotifierProvider registra o SearchProvider na árvore
// de widgets. A partir daqui, qualquer widget descendente pode
// acessar o SearchProvider via context — sem instanciar nada.
//
// O framework gerencia o ciclo de vida do provider:
//   - cria quando o widget entra na árvore
//   - destrói (dispose) quando sai
// ============================================================
class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      // PropertyService é injetado no SearchProvider aqui.
      // A SearchScreen nunca "sabe" de onde vêm os dados.
      create: (_) => SearchProvider(PropertyService()),
      child: MaterialApp(
        title: 'Hospedagem por Temporada',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
          useMaterial3: true,
        ),
        home: const SearchScreen(),
      ),
    );
  }
}
