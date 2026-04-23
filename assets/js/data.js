(function () {
  const projects = [
    {
      id: "celadon",
      category: "tradition",
      title: "龙泉青瓷烧制技艺",
      summary: "以温润釉色与传统柴烧工艺闻名，是中国青瓷审美的重要代表。",
      image: "assets/images/projects/celadon.jpg",
      video: "https://www.bilibili.com/video/BV1xK4y1C7wq",
      history: "龙泉青瓷形成于宋元时期，讲究器型、釉层与火候控制。",
      feature: "核心看点是制坯、施釉、入窑烧制以及梅子青、粉青等釉色变化。",
      value: "它体现了中国传统制瓷工艺与东方审美的高度结合。",
      relatedIds: ["xuanzhi", "blueprint"]
    },
    {
      id: "xuanzhi",
      category: "tradition",
      title: "宣纸制作技艺",
      summary: "以纤维细密、润墨性强著称，是书画创作的重要材料。",
      image: "assets/images/projects/xuanzhi.jpg",
      video: "https://www.bilibili.com/video/BV1rS4y1R7W9",
      history: "宣纸制作延续千年，经历选料、蒸煮、捶洗、捞纸、晒纸等多道工序。",
      feature: "工艺强调青檀树皮与沙田稻草的配比以及纸张自然成形过程。",
      value: "它支撑了中国书法与绘画传统的物质基础。",
      relatedIds: ["celadon", "blueprint"]
    },
    {
      id: "blueprint",
      category: "tradition",
      title: "蓝印花布印染技艺",
      summary: "以镂空版模和靛蓝染色形成朴拙有力的民间图案。",
      image: "assets/images/projects/blueprint.jpg",
      video: "https://www.bilibili.com/video/BV1Yq4y1s7nD",
      history: "蓝印花布广泛流行于江南民间，兼具生活实用与审美装饰功能。",
      feature: "技艺重点在刻版、防染刮浆、反复浸染与晾晒定色。",
      value: "它浓缩了民间图案语言与日常织染智慧。",
      relatedIds: ["celadon", "xuanzhi"]
    },
    {
      id: "spring-festival",
      category: "folk",
      title: "春节年俗",
      summary: "围绕辞旧迎新展开，包括贴春联、守岁、拜年等传统礼俗。",
      image: "assets/images/projects/spring-festival.jpg",
      video: "https://www.bilibili.com/video/BV1f4411e7q4",
      history: "春节是中华民族最重要的节庆之一，形成了稳定的岁时礼仪体系。",
      feature: "年画、灯彩、祭祖和家庭团聚共同构成节日氛围。",
      value: "它强化了家庭、乡土和共同体记忆。",
      relatedIds: ["dragon-boat", "solar-terms"]
    },
    {
      id: "dragon-boat",
      category: "folk",
      title: "端午习俗",
      summary: "以赛龙舟、包粽子、佩香囊等活动体现节令与民俗传统。",
      image: "assets/images/projects/dragon-boat-festival.jpg",
      video: "https://www.bilibili.com/video/BV1yJ411V7bN",
      history: "端午习俗在不同地区形态多样，但都与夏季节令和避疫祈安有关。",
      feature: "龙舟竞渡、草药文化和节庆饮食是最直观的表现。",
      value: "它将节气观念、地方习惯和身体经验连接在一起。",
      relatedIds: ["spring-festival", "solar-terms"]
    },
    {
      id: "solar-terms",
      category: "folk",
      title: "二十四节气",
      summary: "以天时变化指导农事与生活，是中华传统时间观的重要体现。",
      image: "assets/images/projects/solar-terms.jpg",
      video: "https://www.bilibili.com/video/BV1hE411Y7fB",
      history: "二十四节气源于长期农业生产经验，兼具历法和文化内涵。",
      feature: "每个节气都有对应气候现象、农事安排与民俗表达。",
      value: "它将自然观察转化为日常生活秩序与文化认同。",
      relatedIds: ["spring-festival", "dragon-boat"]
    },
    {
      id: "kunqu",
      category: "opera",
      title: "昆曲",
      summary: "唱腔婉转细腻，表演雅致，被誉为百戏之祖。",
      image: "assets/images/projects/kunqu.jpg",
      video: "https://www.bilibili.com/video/BV1Gx411A76Y",
      history: "昆曲形成于明代，长期影响中国戏曲音乐和表演体系。",
      feature: "以曲牌体音乐、程式身段和文学性唱词见长。",
      value: "它保存了高度成熟的传统戏曲审美系统。",
      relatedIds: ["jingju", "yueju"]
    },
    {
      id: "jingju",
      category: "opera",
      title: "京剧",
      summary: "集唱念做打于一体，脸谱、行当和锣鼓点极具辨识度。",
      image: "assets/images/projects/jingju.jpg",
      video: "https://www.bilibili.com/video/BV1mW411B7Vh",
      history: "京剧在清代形成并成熟，融合多地声腔与舞台传统。",
      feature: "生旦净丑行当清晰，脸谱色彩和程式动作鲜明。",
      value: "它是中国戏曲最广为人知的舞台艺术样式之一。",
      relatedIds: ["kunqu", "yueju"]
    },
    {
      id: "yueju",
      category: "opera",
      title: "越剧",
      summary: "以抒情见长，唱腔柔美细腻，深受江南文化影响。",
      image: "assets/images/projects/yueju.jpg",
      video: "https://www.bilibili.com/video/BV1Vs411W7fm",
      history: "越剧形成于浙江嵊州地区，后在上海等城市快速发展。",
      feature: "善于表现才子佳人题材，舞台气质柔和典雅。",
      value: "它展现了地方戏曲在现代都市传播中的生命力。",
      relatedIds: ["kunqu", "jingju"]
    },
    {
      id: "paper-cut",
      category: "handcraft",
      title: "中国剪纸",
      summary: "通过镂空、折剪和纹样组合表现吉祥寓意与生活图景。",
      image: "assets/images/projects/paper-cut.jpg",
      video: "https://www.bilibili.com/video/BV1G7411u7L6",
      history: "剪纸与节庆、婚俗、居室装饰长期相伴，题材极其丰富。",
      feature: "强调对称、节奏和线面结合，图案语言高度概括。",
      value: "它体现了民间审美创造力和象征表达传统。",
      relatedIds: ["suxiu", "bamboo-weaving"]
    },
    {
      id: "suxiu",
      category: "handcraft",
      title: "苏绣",
      summary: "以细密针法和柔润色彩著称，是中国四大名绣之一。",
      image: "assets/images/projects/suxiu.jpg",
      video: "https://www.bilibili.com/video/BV1oT4y1u7dS",
      history: "苏绣深受江南审美和丝织传统影响，形成精雅细致的风格。",
      feature: "针法丰富，常用于花鸟、山水和双面绣作品。",
      value: "它体现了手工刺绣在工艺精度与审美表达上的高度统一。",
      relatedIds: ["paper-cut", "bamboo-weaving"]
    },
    {
      id: "bamboo-weaving",
      category: "handcraft",
      title: "竹编",
      summary: "利用竹材韧性编织器物与装饰品，兼具实用和工艺美感。",
      image: "assets/images/projects/bamboo-weaving.jpg",
      video: "https://www.bilibili.com/video/BV1V54y1r7eD",
      history: "竹编广泛存在于南方生活场景，从日用器物发展到陈设工艺。",
      feature: "破竹、篾丝处理和经纬编织是最关键的技艺步骤。",
      value: "它展示了材料利用智慧与地方生活经验。",
      relatedIds: ["paper-cut", "suxiu"]
    }
  ];

  function getProjectsByCategory(category) {
    return projects.filter((project) => project.category === category);
  }

  function getProjectById(id) {
    return projects.find((project) => project.id === id) || null;
  }

  function getRelatedProjects(id) {
    const current = getProjectById(id);
    if (!current) {
      return [];
    }

    return current.relatedIds
      .map(getProjectById)
      .filter(Boolean)
      .filter((item) => item.id !== id);
  }

  const api = {
    projects,
    getProjectsByCategory,
    getProjectById,
    getRelatedProjects
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  if (typeof window !== "undefined") {
    window.heritageData = api;
  }
})();