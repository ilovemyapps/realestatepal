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






ADU Deep Research ADU可行性分析系统

产品设计文档
一、产品定位
核心理念
"不是全知的AI，而是智能的成本计算器"
从Berkeley报告可以看出，ADU可行性分析的核心不是找到谁建过（这些数据根本搜不到），而是：

理解复杂的多层法规
识别所有成本影响因素
计算真实的投资回报
提供可执行的解决方案

价值主张

为用户节省100+小时的研究时间
避免踩坑，识别隐藏成本
提供类似专业顾问的分析深度
实时更新，永远是最新法规

二、系统架构
五大核心模块
Module 1: Jurisdiction Checker（管辖权确认）

确认地址属于incorporated city还是county
识别具体zoning（如Berkeley的ES-R）
确认ADU是否允许
找到适用的法规层级（州法、市法、特殊条例）

Module 2: Rules Engine（规则引擎）

解析具体的setback、高度、尺寸要求
识别停车、喷淋等特殊要求
计算实际可建面积
评估不同ADU类型的可行性（独立、附属、JADU、车库改造）

Module 3: Property Analyzer（房产分析）

获取地块基础数据（面积、现有建筑）
收集用户关键输入（后院深度、坡度等）
计算各种ADU选项的可行性
生成具体的建议方案

Module 4: Risk & Cost Analyzer（风险成本分析）

识别所有特殊条件（历史区、断层、溪流、火灾区）
计算每个风险的成本影响
提供缓解策略和专家建议
生成风险矩阵（高/中/低）

Module 5: Financial Calculator（财务计算）

汇总所有成本（硬成本+软成本+风险成本）
估算租金收入（基于地区数据）
计算ROI和投资回收期
提供融资方案建议

三、关键创新点
1. 动态搜索 vs 静态数据库
不维护数据库，每次实时搜索最新信息 (未来：维护数据库)

搜索最新的HCD执法函
搜索最新的法规变化（如AB 1033）
搜索实时的费用更新
搜索特殊分区要求

2. 法规冲突识别
GPT-4o智能分析州法vs地方法冲突

识别可能违法的地方要求
提供法律依据和应对策略
建议何时可以威胁投诉HCD

3. 全面的成本透明度
不只说"能不能"，而是说"要多少钱"

基础建设成本
每个特殊条件的额外成本
软成本明细（设计、许可、顾问）
时间成本（延误的机会成本）

