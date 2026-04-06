<p align="center">
  <img src="doc/assets/header.png" alt="Paperclip - runs your business" width="720" />
</p>

<p align="center">
  <a href="#quickstart"><strong>Quickstart</strong></a> &middot;
  <a href="https://paperclip.ing/docs"><strong>Docs</strong></a> &middot;
  <a href="https://github.com/dinhnamit06/c-ng-ty-ai"><strong>This Repo</strong></a> &middot;
  <a href="https://github.com/paperclipai/paperclip"><strong>Upstream</strong></a> &middot;
  <a href="https://discord.gg/m4HZY7xNG3"><strong>Discord</strong></a>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License" /></a>
  <a href="https://github.com/dinhnamit06/c-ng-ty-ai/stargazers"><img src="https://img.shields.io/github/stars/dinhnamit06/c-ng-ty-ai?style=flat" alt="Stars" /></a>
  <a href="https://discord.gg/m4HZY7xNG3"><img src="https://img.shields.io/discord/000000000?label=discord" alt="Discord" /></a>
</p>

# Paperclip

> Open-source orchestration for zero-human companies.
>
> If OpenClaw is an employee, Paperclip is the company.

Paperclip is a Node.js server and React UI that orchestrates a team of AI agents to run a business. Bring your own agents, assign goals, and track work, governance, and costs from one dashboard.

It looks like a task manager, but under the hood it has org charts, budgets, approval gates, goal alignment, and agent coordination.

[Watch the demo video](https://github.com/user-attachments/assets/773bdfb2-6d1e-4e30-8c5f-3487d5b70c8f)

## Why Paperclip

**Manage business goals, not pull requests.**

1. **Define the goal**  
   Example: _"Build the #1 AI note-taking app to $1M MRR."_
2. **Hire the team**  
   CEO, CTO, engineers, designers, and marketers. Any bot, any provider.
3. **Approve and run**  
   Review strategy, set budgets, hit go, and monitor everything from the dashboard.

> **Coming soon: Clipmart**  
> Download and run entire companies with one click. Browse pre-built company templates with org structures, agent configs, and skills, then import them into your Paperclip instance in seconds.

## Works With

- OpenClaw
- Claude Code
- Codex
- Cursor
- Bash
- HTTP

If it can receive a heartbeat, it is hired.

## Paperclip Is Right For You If

- You want to build autonomous AI companies.
- You coordinate many different agents toward a common goal.
- You have too many simultaneous agent sessions and need a single control plane.
- You want agents running autonomously 24/7 while keeping audit visibility and approval control.
- You want to monitor costs and enforce budgets.
- You want a workflow that feels like a task manager instead of a folder full of scripts.
- You want to manage your autonomous businesses from anywhere.

## Features

- **Bring your own agent:** Any agent, any runtime, one org chart. If it can receive a heartbeat, it is hired.
- **Goal alignment:** Every task traces back to the company mission so agents know what to do and why.
- **Heartbeats:** Agents wake on a schedule, check work, and act. Delegation flows up and down the org chart.
- **Cost control:** Monthly budgets per agent. When they hit the limit, they stop.
- **Multi-company:** One deployment can run many companies with complete data isolation.
- **Ticket system:** Conversations are traced, decisions are explained, and tool activity is auditable.
- **Governance:** The board can approve hires, override strategy, pause agents, or terminate them at any time.
- **Org chart:** Hierarchies, roles, and reporting lines are modeled directly in the product.
- **Mobile ready:** Monitor and manage your autonomous businesses from anywhere.

## Problems Paperclip Solves

| Without Paperclip | With Paperclip |
| --- | --- |
| You have many Claude Code tabs open and cannot track which one does what. | Tasks are ticket-based, conversations are threaded, and sessions persist across reboots. |
| You manually gather context from several places to remind a bot what it should do. | Context flows from the task up through the project and company goals. |
| Agent configs are disorganized and you keep rebuilding coordination logic by hand. | Paperclip gives you org charts, ticketing, delegation, and governance out of the box. |
| Runaway loops burn hundreds of dollars of tokens before you notice. | Cost tracking surfaces budgets and throttles agents when they are out. |
| Recurring jobs still need manual kickoffs. | Heartbeats handle regular work on a schedule. |
| Turning an idea into action requires too much babysitting. | Add a task in Paperclip and let the right agent work it through. |

## Why Paperclip Is Special

Paperclip handles the hard orchestration details correctly.

- **Atomic execution:** Task checkout and budget enforcement are atomic, so you avoid double-work and runaway spend.
- **Persistent agent state:** Agents resume the same task context across heartbeats instead of restarting from scratch.
- **Runtime skill injection:** Agents can learn Paperclip workflows and project context at runtime without retraining.
- **Governance with rollback:** Approval gates are enforced, config changes are revisioned, and bad changes can be rolled back safely.
- **Goal-aware execution:** Tasks carry full goal ancestry so agents consistently see the why, not just a title.
- **Portable company templates:** Export and import orgs, agents, and skills with secret scrubbing and collision handling.
- **True multi-company isolation:** Every entity is company-scoped, so one deployment can run many companies safely.

## What Paperclip Is Not

- **Not a chatbot:** Agents have jobs, not chat windows.
- **Not an agent framework:** Paperclip does not tell you how to build agents. It tells you how to run a company made of them.
- **Not a workflow builder:** No drag-and-drop pipelines. Paperclip models companies with org charts, goals, budgets, and governance.
- **Not a prompt manager:** Agents bring their own prompts, models, and runtimes. Paperclip manages the organization around them.
- **Not a single-agent tool:** This is for teams. If you have one agent, you probably do not need Paperclip.
- **Not a code review tool:** Paperclip orchestrates work, not pull requests.

## Quickstart

Open source. Self-hosted. No Paperclip account required.

```bash
npx paperclipai onboard --yes
```

If you already have Paperclip configured, rerunning `onboard` keeps the existing config in place. Use `paperclipai configure` to edit settings.

Or manually:

```bash
git clone https://github.com/dinhnamit06/c-ng-ty-ai.git
cd c-ng-ty-ai
pnpm install
pnpm dev
```

This starts the API server at `http://localhost:3100`. An embedded PostgreSQL database is created automatically, so no extra DB setup is required.

> **Requirements:** Node.js 20+ and pnpm 9.15+

## FAQ

### What does a typical setup look like?

Locally, a single Node.js process manages an embedded Postgres instance and local file storage. For production, point it at your own Postgres and deploy however you like.

If you are a solo entrepreneur, you can use Tailscale to access Paperclip on the go, then later deploy it more formally when needed.

### Can I run multiple companies?

Yes. A single deployment can run multiple companies with complete data isolation.

### How is Paperclip different from agents like OpenClaw or Claude Code?

Paperclip uses those agents. It orchestrates them into a company with org charts, budgets, goals, governance, and accountability.

### Why use Paperclip instead of pointing OpenClaw at Asana or Trello?

Agent orchestration has subtleties around checkout semantics, session continuity, budgeting, governance, and auditing. Paperclip handles those details directly.

### Do agents run continuously?

By default, agents run on scheduled heartbeats and event-based triggers such as task assignment and mentions. You can also hook in continuous agents like OpenClaw.

## Development

```bash
pnpm dev              # Full dev (API + UI, watch mode)
pnpm dev:once         # Full dev without file watching
pnpm dev:server       # Server only
pnpm build            # Build all
pnpm typecheck        # Type checking
pnpm test:run         # Run tests
pnpm db:generate      # Generate DB migration
pnpm db:migrate       # Apply migrations
```

See [doc/DEVELOPING.md](doc/DEVELOPING.md) for the full development guide.

## Roadmap

- [x] Plugin system (knowledge base, custom tracing, queues, and more)
- [x] OpenClaw and claw-style agent employees
- [x] Import and export entire organizations
- [x] Easier `AGENTS.md` configurations
- [x] Skills manager
- [x] Scheduled routines
- [x] Better budgeting
- [ ] Artifacts and deployments
- [ ] CEO chat
- [ ] Maximizer mode
- [ ] Multiple human users
- [ ] Cloud and sandbox agents (for example Cursor or e2b agents)
- [ ] Cloud deployments
- [ ] Desktop app

## Community And Plugins

Find plugins and more at [awesome-paperclip](https://github.com/gsxdsm/awesome-paperclip).

## Telemetry

Paperclip collects anonymous usage telemetry to help improve the product. No personal information, issue content, prompts, file paths, or secrets are collected. Private repository references are hashed with a per-install salt before being sent.

Telemetry is **enabled by default** and can be disabled with any of the following:

| Method | How |
| --- | --- |
| Environment variable | `PAPERCLIP_TELEMETRY_DISABLED=1` |
| Standard convention | `DO_NOT_TRACK=1` |
| CI environments | Automatically disabled when `CI=true` |
| Config file | Set `telemetry.enabled: false` in your Paperclip config |

## Contributing

We welcome contributions. See the [contributing guide](CONTRIBUTING.md) for details.

## Community

- [Discord](https://discord.gg/m4HZY7xNG3) for general discussion
- [GitHub repo](https://github.com/dinhnamit06/c-ng-ty-ai) for this fork
- [Upstream issues](https://github.com/paperclipai/paperclip/issues) for Paperclip bug reports and feature requests

## License

MIT &copy; 2026 Paperclip

## Star History

[![Star History Chart](https://api.star-history.com/image?repos=paperclipai/paperclip&type=date&legend=top-left)](https://www.star-history.com/?repos=paperclipai%2Fpaperclip&type=date&legend=top-left)

---

<p align="center">
  <img src="doc/assets/footer.jpg" alt="" width="720" />
</p>

<p align="center">
  <sub>Open source under MIT. Built for people who want to run companies, not babysit agents.</sub>
</p>
