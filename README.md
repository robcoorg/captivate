# NanoStudio (Captivate)

Near-prototype **Nanobuilder** experience for [captivate.icu](https://captivate.icu/#features).

## Repository

- **Production:** https://captivate.icu/#features  
- **Upstream:** https://github.com/robs46859-eng/captivate.git  

## Development

```bash
npm install
npm run dev
```

- Frontend (Vite): http://localhost:3001  
- API (Express): http://localhost:3000  

## CI/CD

Pull requests and pushes to `main` run **lint**, **build**, and **tests** via GitHub Actions.

| | |
|---|---|
| Workflow | `.github/workflows/ci.yml` |
| Job name | `build-lint-test` |
| Details | [docs/CI.md](./docs/CI.md) |

Configure **branch protection** on `main` to require check `build-lint-test` so merges are blocked when CI fails. See [docs/CI.md](./docs/CI.md#branch-protection-default-branch).

## Environment

- Template: [.env.example](./.env.example)  
- Variable inventory, staging parity, and where to store secrets: [docs/ENVIRONMENT.md](./docs/ENVIRONMENT.md)  
- PostgreSQL schema apply and rollback: [docs/DATABASE.md](./docs/DATABASE.md)

## License

Private / internal unless noted otherwise.
