## Fiabiliser le déploiement frontend : éviter le mismatch de Build ID SSR/statique

### Contexte

L'erreur **500 – "Importing a module script failed"** survient côté client lorsque le build ID du serveur SSR Nitro (en mémoire) ne correspond plus aux fichiers statiques `_nuxt/` sur le disque.

### Problème constaté (24 fév. 2026)

| Élément                          | Build ID   | Statut                              |
| -------------------------------- | ---------- | ----------------------------------- |
| Serveur SSR (HTML rendu)         | `b7b5a3bd` | Actif                               |
| `latest.json` (fichier statique) | `e190fd6f` | Pointe vers un build **inexistant** |
| Meta `e190fd6f`                  | —          | **404**                             |

#### Scénario de reproduction

1. Deux déploiements rapprochés
2. Le `rsync --delete` écrase les fichiers statiques avec un nouveau build
3. Le restart du serveur Node.js via l'API Infomaniak échoue silencieusement
4. Le serveur SSR continue de servir l'ancien build → mismatch

### Diagnostic

```bash
# Comparer le build ID du SSR et de latest.json
curl -s https://chablaisfischer.ch/ | grep -o 'buildId:"[^"]*"'
curl -s https://chablaisfischer.ch/_nuxt/builds/latest.json

# Vérifier que le meta file existe (doit retourner 200)
curl -sI https://chablaisfischer.ch/_nuxt/builds/meta/<id-from-latest>.json | head -1
```

### Améliorations proposées

#### 1. Vérifier le redémarrage du serveur dans le workflow

Ajouter une vérification que l'appel API Infomaniak a bien réussi (HTTP 200), et faire échouer le workflow sinon.

#### 2. Ajouter `workflow_dispatch` au workflow frontend

Permettre de re-déclencher manuellement un déploiement sans pousser un commit.

#### 3. Ajouter un gestionnaire d'erreur côté client (résilience)

Dans le code Nuxt, intercepter les erreurs de chargement de modules dynamiques et forcer un rechargement complet de la page pour auto-corriger.

#### 4. Documenter le diagnostic

✅ Fait – ajouté dans `.github/copilot-instructions.md` (section Troubleshooting).
