import os
def test_env_template_exists():
    assert os.path.exists(".env.example")
