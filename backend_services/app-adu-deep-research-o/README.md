# ADU Deep Research · 可行性分析系统

> 核心理念：**不是全知的 AI，而是“智能的成本计算器”**。本仓库为可直接运行的 FastAPI 服务端，实现统筹/搜索双模型编排（GPT‑5 统筹 + gpt‑4o-mini-search-preview 搜索），并内置 5 大模块骨架与示例端到端接口。

## 架构概览

- **Orchestrator (GPT‑5)**：分配子任务、调用工具、合并结果、生成报告
- **Searcher (gpt‑4o-mini-search-preview + web_search)**：动态检索法规/费用/执法函并返回结构化 JSON 与引用
- **五大模块**
  1) Jurisdiction Checker（管辖权确认）
  2) Rules Engine（规则引擎）
  3) Property Analyzer（房产分析）
  4) Risk & Cost Analyzer（风险成本分析）
  5) Financial Calculator（财务计算）

> 设计目标：每次请求“实时搜索”，不依赖陈旧数据库；以**成本/风险**为主线，给出**可执行方案**与**法律依据**。

## 快速开始

```bash
# 1) Python 3.11+
python -m venv .venv && source .venv/bin/activate

# 2) 依赖
pip install -r requirements.txt

# 3) 配置环境变量（统一服务端密钥）
cp .env.example .env
# 编辑 .env，填入：OPENAI_API_KEY=sk-...

# 4) 启动
uvicorn app.main:app --reload
# 打开 http://127.0.0.1:8000/docs
```

### 一条命令体验
```bash
make dev
```

## 示例请求

```bash
curl -X POST http://127.0.0.1:8000/analyze   -H "Content-Type: application/json"   -d '{
    "address": "690 Panoramic Way, Berkeley, CA",
    "user_overrides": {"backyard_depth_ft": 32, "slope_degree": 18},
    "targets": {"adu_type": "detached", "size_sqft": 750}
  }'
```

## 关键实现点
- 使用 **OpenAI Responses API**（工具调用 + 结构化输出）
- **Orchestrator** 注册函数工具（成本计算/租金估算），模型“自动”调用
- **Searcher** 启用 `tools=[{"type":"web_search"}]` 并约束为 JSON 结构输出 + 引用列表
- 所有模块均**可替换**为真实外部 API（GIS、县市费表、HCD 执法函库等）

> 注意：本仓库包含**可运行的最小闭环**，外部数据调用采用最小化 stub，以便先跑通“端到端”。
