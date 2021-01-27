var REPORT_INFO = {
  ACCESS: {
    ON: 'on',
    OFF: 'off',
    SPECIFY: 'specify'
  },
  GRAPHTYPE: {
    FLOW_REPORT: 'flow_report_graph',
    THREAT_REPORT: 'threat_report_graph',
    SPHIT_REPORT: 'sphit_report_graph'
  },
  TRIGGER_OPTION: [
    {
      boxlabel: '叠加图',
      inputValue: 'area_chart',
      checked: true
    },
    {
      boxlabel: '折线图',
      inputValue: 'line_chart'
    },
    {
      boxlabel: '柱状图',
      inputValue: 'bar_chart'
    },
    {
      boxlabel: '饼图',
      inputValue: 'pie_chart'
    }
  ],
  FLOW_REPORT: {
    NAME: '流量报表',
    CONDITION: [
      {
        label: '源地址',
        value: 'flow_src_ip'
      },
      {
        label: '目的地址',
        value: 'flow_dst_ip'
      },
      {
        label: '安全策略',
        value: 'flow_sp'
      },
      {
        label: '接口',
        value: 'flow_if'
      },
      {
        label: '应用',
        value: 'flow_app'
      },
      {
        label: '应用组',
        value: 'flow_app_group'
      },
      {
        label: '用户',
        value: 'flow_user'
      }
    ],
    RADIO_OPTION: [
      {
        boxlabel: '上行流量',
        inputValue: 'up_flow',
        checked: true
      },
      {
        boxlabel: '下行流量',
        inputValue: 'down_flow'
      },
      {
        boxlabel: '总流量',
        inputValue: 'total_flow'
      }
    ],
    TYPE: {
      flow_src_ip: '源地址',
      flow_dst_ip: '目的地址',
      flow_sp: '安全策略',
      flow_if: '接口',
      flow_app: '应用',
      flow_app_group: '应用组',
      flow_user: '用户'
    },
    CHECKBOX_CONDITION: ["flow_src_ip", "flow_dst_ip", "flow_sp", "flow_if", "flow_app", "flow_app_group", "flow_user"]

  },
  SPHIT_REPORT: {
    NAME: '策略命中报表',
    CONDITION: [
      {
        label: '安全策略',
        value: 'sphit_sp'
      }
    ],
    RADIO_OPTION: [
      {
        boxlabel: '安全策略命中次数',
        inputValue: 'cnt',
        checked: true
      }
    ],
    TYPE: {
      sphit_sp: '安全策略'
    }
  },
  THREAT_REPORT: {
    NAME: '威胁报表',
    CONDITION: [
      {
        label: '攻击者',
        value: 'threat_src_ip'
      },
      {
        label: '攻击目标',
        value: 'threat_dst_ip'
      },
      {
        label: '安全策略',
        value: 'threat_sp'
      },
      {
        label: '威胁类型',
        value: 'threat_threat_type'
      },
      {
        label: '威胁名称',
        value: 'threat_threat_name'
      }
    ],
    RADIO_OPTION: [
      {
        boxlabel: '威胁次数',
        inputValue: 'cnt',
        checked: true
      }
    ],
    TYPE: {
      threat_src_ip: '攻击者',
      threat_dst_ip: '攻击目标',
      threat_sp: '安全策略',
      threat_threat_name: '威胁名称',
      threat_threat_type: '威胁类型'
    },
    CHECKBOX_CONDITION: ["threat_src_ip", "threat_dst_ip", "threat_sp", "threat_threat_name", "threat_threat_type"]
  },
  COMBO_REPORT: {
    CHECKBOX: {
      FLOW_REPORT: [
        {
          boxlabel: "源地址",
          inputValue: "flow_src_ip"
        },
        {
          boxlabel: "目的地址",
          inputValue: "flow_dst_ip"
        },
        {
          boxlabel: "安全策略",
          inputValue: "flow_sp"
        },
        {
          boxlabel: "接口",
          inputValue: "flow_if"
        },
        {
          boxlabel: "应用",
          inputValue: "flow_app"
        },
        {
          boxlabel: "应用组",
          inputValue: "flow_app_group"
        },
        {
          boxlabel: "用户",
          inputValue: "flow_user"
        }
      ],
      SPHIT_REPORT: [
        {
          boxlabel: "安全策略",
          inputValue: "on",
          uncheckedValue: "off"
        }
      ],
      THREAT_REPORT: [
        {
          boxlabel: "攻击者",
          inputValue: "threat_src_ip"
        },
        {
          boxlabel: "攻击目标",
          inputValue: "threat_dst_ip"
        },
        {
          boxlabel: "安全策略",
          inputValue: "threat_sp"
        },
        {
          boxlabel: "威胁名称",
          inputValue: "threat_threat_name"
        },
        {
          boxlabel: "威胁类型",
          inputValue: "threat_threat_type"
        }
      ],
      SELECT_ALL: [
        {
          boxlabel: "全选",
          inputValue: "all"
        }
      ]
    }
  }
};
