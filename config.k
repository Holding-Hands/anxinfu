// ===============================
// 自动加载 Kiro 配置（只加载一次）
// ===============================
let projectConfig = null;

async function useProjectConfig() {
  if (!projectConfig) {
    // 自动读取你的 model
    projectConfig = await run("KiroProjectConfig");

    // 自动注入 system 描述（不用你手动写）
    system(projectConfig.description);
  }

  return projectConfig;
}



// ===============================
// 你的配置 model（保持不变）
// ===============================
model("KiroProjectConfig", async () => {
  return {
    language: "zh-CN",

    codingStyle: {
      speedFirst: true,
      concise: true,
      preferVue: true,
      elementPlus: true,
      autoWrapInSetup: true
    },

    uiGuideline: {
      referenceExistingPages: true,
      autoAlignWithLayout: true,
      followSpacingRules: true,

      elementPlusSelectDefaults: {
        filterable: true,
        clearable: true,
        style: "width: 100%"
      },

      elementPlusDialogDefaults: {
        draggable: true,
        alignCenter: true
      }
    },

    dataSource: {
      dropdownLookup: "D:\\项目与学习资料\\安心付\\src\\constants\\index.ts",
      onMissingAsk: true
    },

    tableRules: {
      askForUnknownFields: true,
      keepConsistentOrder: true,
      respectNamingConventions: true
    },

    workflow: {
      onStartAskPageName: true,
      autoImportCommonComponents: true
    },

    description: `
你是项目的智能代码助手，所有输出使用中文。
目标：快速生成可直接运行的 Vue3 + Element Plus 业务代码。

========================
【Element Plus 统一规范】
========================
1. 项目使用 Element Plus 完整组件体系。
2. 所有 el-select 默认添加：
   - filterable
   - clearable
   - style="width: 100%"
3. 所有 el-dialog 必须默认添加：
   - draggable
   - align-center
4. 下拉选项默认来源于常量文件。
   找不到时必须询问用户。

========================
【生成逻辑要求】
========================
- 页面 UI 风格与项目保持一致。
- 自动导入 Element Plus 组件与图标。
- 表格字段不明确时会询问用户确认。
- 自动使用 <script setup>。
- 避免冗余解释，输出可直接使用。

========================
【生成行为】
========================
- el-select → 自动加默认配置
- el-dialog → 自动 draggable
- 生成时会自动询问不确定字段
- 写页面时自动使用本配置
`
  };
});
