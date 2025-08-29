.PHONY: dev fmt test
dev:
	uvicorn app.main:app --reload --port 8000

fmt:
	python -m pip install ruff==0.5.6 black==24.8.0 && ruff check --fix . && black .

test:
	pytest -q
