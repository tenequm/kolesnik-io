---
title: "I made vector search the default. My agents did better with BM25."
description: 'I judged all 1,126 searches my agents ran over 63 days, then replayed 90 of them blind. BM25 found what the agent needed 61% of the time against 37%, so I removed the embeddings machinery from the default path.'
pubDate: 2026-09-08
draft: false
---

When building the first iteration of [pond](https://github.com/tenequm/pond), my session archive, the starting point for me was to choose a proper vector database. I didn't have an answer to why, but there was no doubt it was needed.

My goal was simple, I wanted the best in class search and where could I get it if not from semantic searches that magically just give you back what you need whenever you query it.

First cracks appeared when I wanted to make my archiver binary operate fully locally and stay lightweight on resources, so that it could be used as an MCP in each agent tab I'm running without blowing up my RAM usage. And with that requirement I had to start looking for a smaller model as at the time I used Qwen3-Embedding-8B.

I started playing around with different smaller options, benchmarking them and trying to understand how small could I go without degrading my search outputs. I stopped at e5-small as the smallest decent option and was laser focused on making it work in a 'lightweight' mode.

Unfortunately, no matter what I did I couldn't go less than ~650MB of RAM when loaded on macOS with it because of different quirks of the way this model was supported for Metal architecture. In parallel I also had to first think through how I wanted to make FTS search work for the same content, what tokenizer to choose and how that would impact the performance of everything else when all DB lives on remote S3 storage.

In this period I first started benchmarking both semantic and FTS search queries on the data. And as it happens with benchmarks, without having clean use case references it became more of a lottery than a clear answer to what actually would work on your corpus.

The queries I was making were always giving the results I needed if tweaked here or there a little. But they didn't answer whether the samples I prepared would actually in practice reflect how an agent would use that search for typical use cases.

The other thing that bothered me was a feeling that an agent couldn't find anything at all when searching, while I knew data was there. That's when I decided to spend some time and evaluate the performance of each search type having real requests that were made and real data they were made on. Outcomes were judged by an LLM tracing what agent did immediately after the search, whether it used results or did more searches after it.

| Evaluation | BM25 FTS | Vector |
|---|---:|---:|
| Historical searches judged successful - 1,126 calls over 63 days | 149/243 (61%) | 323/883 (37%) |
| Same-query comparison - 90 queries, 29 ties | 41 wins | 20 wins |
| Mean query latency in the separate 120-query replay | 0.39s | 0.99s |

Seeing that I first couldn't believe the data and thought that I'm doing the searches wrong, and that with proper params the situation would improve. But it didn't.

> actor reentrancy await state flag race bug ghost stale generation token

For this example BM25 retrieved the Blackbox app's ghost-recording bug I was searching for, when semantic search was returning the account-token generation and login-related messages.

And the only thing I was certain I didn't want to do was trying to solve that with instructing agents to do searches 'in the correct way' as it will never work when you expect your search to be usable by any model doing tool calls.

My next reaction was a relief of being finally able to remove a big complexity chunk from the app, while being sure that it not only makes the whole design much lighter and app simpler - but also makes the search results better on average.

As a result I removed embeddings machinery from the default path in the app and left only BM25 FTS based search.

For pond's case FTS was probably the best call from the beginning, I just didn't have enough data to get certain proof of that. And while there are cases where semantic search would cleanly outperform FTS, for such a broad scope as agentic sessions it appeared to be an unnecessary complexity with too expensive a cost for the value it was bringing.

Full eval - method, judge rubric and per-arm data is [in the pond repo](https://github.com/tenequm/pond/tree/main/docs/researches/2608-21-semantic-vs-fts-usage-eval).
