# ADU Deep Research System

## 🚀 快速开始

### 1. 安装依赖
```bash
pip install -r requirements.txt
```

### 2. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，添加你的 OpenAI API Key
```

### 3. 运行服务
```bash
python -m uvicorn app.main:app --reload
```

### 4. 访问API文档
打开浏览器访问: http://localhost:8000/docs

## 📝 API使用示例

### 完整分析
```bash
curl -X POST "http://localhost:8000/api/v1/analysis/full" \
  -H "Content-Type: application/json" \
  -d '{
    "address": "1234 Main St, Berkeley, CA 94704",
    "lot_size_sqft": 6000,
    "existing_structure_sqft": 1500,
    "adu_type_preference": "detached",
    "budget": 250000
  }'
```

### 快速分析
```bash
curl -X POST "http://localhost:8000/api/v1/analysis/quick?address=1234 Main St, Berkeley, CA"
```

## 🏗️ 系统架构

- **GPT-5**: 统筹Agent，负责整体分析流程
- **GPT-4o-mini-search-preview**: 搜索Agent，获取最新法规
- **FastAPI**: 高性能Web框架
- **异步处理**: 提高并发性能

## 📄 许可证

MIT License
