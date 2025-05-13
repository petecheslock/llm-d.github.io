---
sidebar_position: 3
label: FAQ
---

# Frequently Asked Questions

## Q: What is llm-d?
**A:** llm-d is a new open source project focused on providing distributed inferencing for Generative AI runtimes on any Kubernetes cluster. Its architecture is designed for high performance and scalability, aiming to reduce costs through a spectrum of hardware and software efficiency improvements. llm-d prioritizes ease of deployment and use, as well as the operational needs of running large GPU clusters, including SRE concerns and day 2 operations. At launch, its key features include prefill/decode disaggregation, KV cache distribution and management, an AI-aware router with customizable scoring, operational telemetry, Kubernetes-based deployment, and the NIXL inference optimized transfer library.

## Q: What is the goal of the llm-d project?
**A:** The llm-d project aims to efficiently route and manage AI inference requests, specifically leveraging cache-aware caching algorithms to improve inference performance. The overall goal is to develop a flexible, efficient routing mechanism based on prefix caching or advanced cache awareness. 

## Q: What is the engineering design philosophy for the project?
**A:**
llm-d will leverage existing OSS projects where possible.
While the initial MVP release supports NVIDIA GPUs (including Blackwell), we welcome support to be added for any accelerator. For example, we have significant work underway with AMD.and Intel.
Language-model focused for MVP, adding multi-modal support as prioritized by community.
All work on vLLM itself must happen upstream in the vllm-project to ensure it remains the reference implementation within the vLLM community.
We will build a system that autonomously meets user cost/performance targets while maintaining user-defined SLOs.
Aspiring to vLLM itself, we will have the most performant and featureful open source Intelligent router for AI workloads on Kubernetes.

## Q: What are the key features of llm-d being presented at Red Hat Summit?
**A:** At Red Hat Summit, we plan to showcase three key features: prefill/decode disaggregation, KV Cache aware routing, and an AI-aware inference-optimized router. These demos will highlight the performance benefits of these features, demonstrating improvements in Time-To-First-Token (TTFT), reduced latency, increased throughput, and improve resource utilization, leading to significant cost savings. Our goal is to show that both user experience (TTFT, latency, throughput) and cost-efficiency can be achieved simultaneously through a continuous stream of technical innovation from the llm-d community..

## Q: Is any Red Hat subscription required to use llm-d?
**A:** No. In fact we worked with CoreWeave to add support for CoreWeave Kubernetes Service (ubuntu) for launch!

## Q: We don’t use podman. Can we still use llm-d?.
**A:** Any CRI compatible container engine (such as docker-ce) will work, and we document it.

## Q: We don’t use vLLM. Can we still try llm-d?
## **A:** While llm-d is deeply integrated with vLLM, if the community wanted to add support for another inference engine, the community and maintainers would review it as any proposal..

## Q: What is an AI-aware inference-optimized router?
**A:** The router implementation in llm-d is one of its key features. We leverage the Gateway API Inference Extension for Kubernetes. As founding members of wg-serving and the inference extensions workstream, the group of launch partners behind llm-d have extended GAIE significantly during the bootstrapping of the llm-d project.. Our default implementation uses Envoy Proxy. The router will be the primary UX for a spectrum of software efficiency improvements (implemented as scheduler plugins) called scorers.

## Q: What is a scorer?
**A:** Along with llm-d, we have also released a set of custom plugins that implement features like prefill/decode disaggregation. Other scorers optimize performance based on prefix, load or kv-cache locality. These scheduler components get loaded into the Gateway component of llm-d. An "Endpoint Picker (EPP)" binary and container images are provided which can be configured via Envoy's ext-proc feature to make optimized routing decisions for AI Inference requests to backend model serving platforms (e.g. vLLM).

This functionality is built upon Gateway API and the Gateway API Inference Extension (GIE) projects for both the API resources and machinery, but extends support beyond what's available in those projects by loading other custom plugins needed by llm-d (e.g. custom scorers, P/D Disaggregation, etc).
**A:** It looks at a prompt and decides what to do with it based on user desired state.

Because we know what type of traffic we will handle (we see L7), we can optimize the router’s behavior for inference.

## Q: What is KV Cache Aware Routing in llm-d?
**A:** KV Cache Aware Routing in llm-d is a mechanism that optimizes the routing of inference requests based on the availability and reuse of the KV cache. The KV cache stores previously computed key and value attention vectors, which can significantly reduce computation time for subsequent requests, especially those sharing similar prefixes or context. By routing requests to nodes with existing relevant KV cache, llm-d aims to reduce Time-To-First-Token (TTFT) and improve overall performance. This routing is facilitated by a global KV cache index that maps cache blocks to their locations, allowing the router to make informed decisions about where to send each request. LMCache is involved as a KV cache engine.

## Q: What is prefill/decode disaggregation in llm-d?
**A:** Prefill/decode disaggregation is a feature in llm-d that separates the inference process into two stages: prefill and decode. The prefill stage handles the initial processing of the input prompt, including tokenization and KV cache population. The decode stage generates the actual output tokens using the prefilled cache. This separation allows for optimized allocation of compute resources, as different types of hardware or configurations might be better suited for each stage. It aims to improve resource utilization, enable more efficient scheduling, and maintain high throughput and low latency, especially in heterogeneous environments. NIXL is used for KV transport in this process.

## Q: What is LMCache's role in llm-d?
**A:** LMCache acts as a KV Cache Engine within llm-d. Its role is to support KV cache offloading and sharing between vLLM nodes, which enhances performance by enabling reuse of previously computed KV caches. LMCache maintains a shared KV cache metadata store (Redis) that is used for KV Cache Indexing, allowing the system to track the location of cache blocks and optimize routing for KV cache hits. LMCache is currently the only open-source KVCache offloading/reusing engine and is crucial for enabling features like KV Cache Aware Routing in llm-d. It facilitates cross-node sharing by maintaining a global KV locality-index, enabling cross-node KVCache reuse. We spent time making these interfaces clean and pluggable.

## Q: Where do I submit feedback, bug reports or feature requests?
**A:** Check out the CONTRIBUTING.md. We’re using GitHub, so submit your issue or PR to the relevant repository.
