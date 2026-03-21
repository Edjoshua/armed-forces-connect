import 'package:flutter/material.dart';
import '../widgets/stats_card.dart';

class PersonnelDashboard extends StatelessWidget {
  const PersonnelDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    // Sample data - corresponds to soldiers array in React
    final soldiers = [
      {'id': 'MWIC-0042381', 'name': 'SGT. Abubakar Mohammed', 'unit': '3rd Armoured Division', 'status': 'Active', 'savings': '₦580,000', 'children': 2},
      {'id': 'MWIC-0015992', 'name': 'CPL. Oluwaseun Bello', 'unit': '72 Special Forces', 'status': 'Deployed', 'savings': '₦320,000', 'children': 1},
      {'id': 'MWIC-0078114', 'name': 'PVT. Ibrahim Yusuf', 'unit': '7th Infantry Brigade', 'status': 'Active', 'savings': '₦145,000', 'children': 0},
      {'id': 'MWIC-0031006', 'name': 'LT. Chioma Okafor', 'unit': 'Nigerian Navy Western Fleet', 'status': 'Active', 'savings': '₦920,000', 'children': 2},
      {'id': 'MWIC-0056773', 'name': 'MAJ. Emeka Nwankwo', 'unit': 'Air Force Combat Command', 'status': 'On Leave', 'savings': '₦1,250,000', 'children': 2},
    ];

    final statusColor = {
      'Active': Colors.green,
      'Deployed': Colors.orange,
      'On Leave': Colors.blue,
    };

    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Military Personnel',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          const Text(
            'Manage verified armed forces members and beneficiaries',
            style: TextStyle(color: Colors.grey),
          ),
          const SizedBox(height: 16),
          // Stats cards - corresponds to StatsCard in React
          Row(
            children: [
              Expanded(child: StatsCard(icon: Icons.people, title: 'Total Personnel', value: '142,380', change: '+312 this month')),
              Expanded(child: StatsCard(icon: Icons.shield, title: 'Verified IDs', value: '141,890', change: '99.7% verified')),
              Expanded(child: StatsCard(icon: Icons.check_circle, title: 'Active Beneficiaries', value: '198,450', change: 'Dependents enrolled')),
            ],
          ),
          const SizedBox(height: 16),
          // Personnel Registry - corresponds to the table in React
          Expanded(
            child: Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Expanded(
                          child: Text('Personnel Registry', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                        ),
                        Row(
                          children: [
                            SizedBox(
                              width: 200,
                              child: TextField(
                                decoration: const InputDecoration(
                                  hintText: 'Search by MWIC or name...',
                                  prefixIcon: Icon(Icons.search),
                                  border: OutlineInputBorder(),
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            ElevatedButton.icon(
                              onPressed: () {},
                              icon: const Icon(Icons.filter_list),
                              label: const Text('Filter'),
                            ),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Expanded(
                      child: SingleChildScrollView(
                        child: DataTable(
                          columns: const [
                            DataColumn(label: Text('MWIC ID')),
                            DataColumn(label: Text('Name')),
                            DataColumn(label: Text('Unit')),
                            DataColumn(label: Text('Status')),
                            DataColumn(label: Text('Savings')),
                            DataColumn(label: Text('Children')),
                          ],
                          rows: soldiers.map((soldier) {
                            return DataRow(
                              cells: [
                                DataCell(Text(soldier['id'] as String, style: const TextStyle(fontFamily: 'monospace'))),
                                DataCell(Text(soldier['name'] as String, style: const TextStyle(fontWeight: FontWeight.w500))),
                                DataCell(Text(soldier['unit'] as String)),
                                DataCell(
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: (statusColor[soldier['status']] ?? Colors.grey).withOpacity(0.1),
                                      border: Border.all(color: statusColor[soldier['status']] ?? Colors.grey),
                                      borderRadius: BorderRadius.circular(4),
                                    ),
                                    child: Text(soldier['status'] as String),
                                  ),
                                ),
                                DataCell(Text(soldier['savings'] as String, style: const TextStyle(fontFamily: 'monospace'))),
                                DataCell(Text('${soldier['children']}')),
                              ],
                            );
                          }).toList(),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}