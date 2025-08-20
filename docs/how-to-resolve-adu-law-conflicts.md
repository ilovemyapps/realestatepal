美国法律体系中的优先权层级（Preemption Hierarchy）。让我详细解释：
法规层级和优先权原则
1. 三层管辖同时适用
每个地址确实同时受到三个层级的管辖：
州法律 (State Law)
    ↓
县法规 (County Code) - 仅适用于非建制地区
    或
市法规 (City Code) - 适用于城市范围内
    ↓
其他特殊规定 (Overlay Districts, HOA等)
2. 冲突解决原则 - 谁的规定优先？
核心原则：更严格的规定优先（Most Restrictive Rule Applies）
但在ADU领域有特殊情况：
javascript{
  "conflict_resolution": {
    "general_rule": "地方可以更严格，但不能低于州最低标准",
    "adu_special_provisions": {
      "state_minimum_protections": [
        "必须允许至少一个ADU",
        "审批时间不超过60天",
        "不能要求额外停车位（近公交站半英里内）",
        "不能禁止750平方英尺以下的ADU"
      ],
      "local_cannot_override": [
        "州法保障的最小尺寸",
        "ministerial approval（行政审批）要求",
        "费用豁免规定"
      ]
    }
  }
}
3. 实际冲突案例
案例1：尺寸限制
json{
  "size_conflict_example": {
    "state_law": "必须允许至少850平方英尺（1卧）或1000平方英尺（2卧+）",
    "burbank_city": "限制独立式ADU为500平方英尺",
    "result": "违法！加州HCD已经多次要求Burbank修改",
    "who_wins": "州法律胜出"
  }
}
案例2：停车要求
json{
  "parking_conflict": {
    "state_law": "距离公交站0.5英里内不能要求停车位",
    "local_city": "想要求1个停车位",
    "result": "在0.5英里范围内，城市规定无效",
    "who_wins": "州法律胜出"
  }
}
案例3：设计标准
json{
  "design_standards": {
    "state_law": "允许客观设计标准",
    "beverly_hills": "要求特定建筑风格和材料",
    "result": "允许，因为不违反州最低标准",
    "who_wins": "地方可以添加额外要求"
  }
}
4. 具体优先权规则
情况谁的规定生效例子州法设定最低标准州法律必须允许ADU、60天审批地方想更宽松地方规定San Jose允许更大的ADU地方想更严格（不违反州法）地方规定额外的设计要求地方想更严格（违反州法）州法律不能禁止ADU、不能要求5年自住州法没规定的领域地方规定景观要求、颜色限制
5. HCD的执法角色
California Department of Housing and Community Development (HCD) 负责执法：
json{
  "hcd_enforcement": {
    "compliance_review": "HCD审查地方法规是否符合州法",
    "violation_cases": {
      "palo_alto": "2022年被要求修改过严的规定",
      "glendale": "2022-2024年多次审查",
      "woodside": "2022年'mountain lion'借口被驳回"
    },
    "consequences": [
      "要求修改法规",
      "可能失去州资金",
      "法律诉讼风险"
    ]
  }
}
6. 实用决策树
对于投资者，判断规则如下：
1. 先看州法律的最低保障 ✓
2. 查看当地是否有更宽松的规定 → 如果有，用地方的
3. 查看当地的额外要求 → 如果不违反州法，必须遵守
4. 特殊地区限制（火灾区、海岸区）→ 可能完全禁止
7. 典型覆盖情况
json{
  "coverage_examples": {
    "los_angeles_address": {
      "state": "AB 68, AB 881, SB 13等",
      "city": "Ordinance 186481, LAMC 12.22.A.33",
      "building": "CBC Title 24 + LA Building Code",
      "special": "如在山区，可能被VHFHSZ禁止"
    },
    "unincorporated_la_county": {
      "state": "同样的州法",
      "county": "Title 22, Section 22.140.640",
      "building": "CBC Title 24 + County Building Code",
      "special": "县特殊规定"
    }
  }
}
关键要点

不是"覆盖"而是"叠加" - 所有层级的法规同时适用
州法设定底线 - 地方不能低于州标准
地方可以更严 - 但不能违反州法基本权利
HCD会执法 - 确保地方遵守州法
查询顺序：州法底线 → 地方规定 → 特殊限制

对你的AI系统来说，需要：

检查所有适用层级的法规
识别冲突并应用正确的优先权规则
特别注意州法的"不可违反"条款