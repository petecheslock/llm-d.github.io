---
title: "Latest Release: v0.4.0"
description: "llm-d v0.4.0 release - component versions and documentation"
sidebar_label: Latest Release
sidebar_position: 1
---

# llm-d v0.4.0

**Released**: November 26, 2025

**Full Release Notes**: [View on GitHub](https://github.com/llm-d/llm-d/releases/tag/v0.4.0)

The llm-d ecosystem consists of multiple interconnected components that work together to provide distributed inference capabilities for large language models.

## Components

| Component | Description | Repository | Version | Documentation |
|-----------|-------------|------------|---------|---------------|
| **[Inference Scheduler](https://github.com/llm-d/llm-d-inference-scheduler)** | This scheduler that makes optimized routing decisions for inference requests to the llm-d inference framework. | [llm-d/llm-d-inference-scheduler](https://github.com/llm-d/llm-d-inference-scheduler) | [v0.3.2](https://github.com/llm-d/llm-d-inference-scheduler/releases/tag/v0.3.2) | [View Docs](./Components/inference-scheduler) |
| **[Model Service](https://github.com/llm-d-incubation/llm-d-modelservice)** | `modelservice` is a Helm chart that simplifies LLM deployment on llm-d by declaratively managing Kubernetes resources for serving base models. It enables reproducible, scalable, and tunable model deployments through modular presets, and clean integration with llm-d ecosystem components (including vLLM, Gateway API Inference Extension, LeaderWorkerSet). | [llm-d-incubation/llm-d-modelservice](https://github.com/llm-d-incubation/llm-d-modelservice) | [llm-d-modelservice-v0.3.8](https://github.com/llm-d-incubation/llm-d-modelservice/releases/tag/llm-d-modelservice-v0.3.8) | [View Docs](./Components/modelservice) |
| **[Inference Simulator](https://github.com/llm-d/llm-d-inference-sim)** | A light weight vLLM simulator emulates responses to the HTTP REST endpoints of vLLM. | [llm-d/llm-d-inference-sim](https://github.com/llm-d/llm-d-inference-sim) | [v0.6.1](https://github.com/llm-d/llm-d-inference-sim/releases/tag/v0.6.1) | [View Docs](./Components/inference-sim) |
| **[Infrastructure](https://github.com/llm-d-incubation/llm-d-infra)** | A helm chart for deploying gateway and gateway related infrastructure assets for llm-d. | [llm-d-incubation/llm-d-infra](https://github.com/llm-d-incubation/llm-d-infra) | [v1.3.4](https://github.com/llm-d-incubation/llm-d-infra/releases/tag/v1.3.4) | [View Docs](./Components/infra) |
| **[KV Cache Manager](https://github.com/llm-d/llm-d-kv-cache-manager)** | This repository contains the llm-d-kv-cache-manager, a pluggable service designed to enable KV-Cache Aware Routing and lay the foundation for advanced, cross-node cache coordination in vLLM-based serving platforms. | [llm-d/llm-d-kv-cache-manager](https://github.com/llm-d/llm-d-kv-cache-manager) | [v0.3.0](https://github.com/llm-d/llm-d-kv-cache-manager/releases/tag/v0.3.0) | [View Docs](./Components/kv-cache-manager) |
| **[Benchmark Tools](https://github.com/llm-d/llm-d-benchmark)** | This repository provides an automated workflow for benchmarking LLM inference using the llm-d stack. It includes tools for deployment, experiment execution, data collection, and teardown across multiple environments and deployment styles. | [llm-d/llm-d-benchmark](https://github.com/llm-d/llm-d-benchmark) | [v0.3.0](https://github.com/llm-d/llm-d-benchmark/releases/tag/v0.3.0) | [View Docs](./Components/benchmark) |

## Getting Started

Each component has its own detailed documentation page accessible from the sidebar. For a comprehensive view of how these components work together, see the main [Architecture Overview](./architecture.mdx).

### Quick Links

- [Main llm-d Repository](https://github.com/llm-d/llm-d) - Core platform and orchestration
- [llm-d-incubation Organization](https://github.com/llm-d-incubation) - Experimental and supporting components
- [Full Release Notes](https://github.com/llm-d/llm-d/releases/tag/v0.4.0) - Release v0.4.0
- [All Releases](https://github.com/llm-d/llm-d/releases) - Complete release history

## Previous Releases

For information about previous versions and their features, visit the [GitHub Releases page](https://github.com/llm-d/llm-d/releases).

## Contributing

To contribute to any of these components, visit their respective repositories and follow their contribution guidelines. Each component maintains its own development workflow and contribution process.
