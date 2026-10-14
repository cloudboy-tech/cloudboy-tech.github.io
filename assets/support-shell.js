"use strict";
(() => {
  const $ = (id) => document.getElementById(id);
  const all = (selector) => Array.from(document.querySelectorAll(selector));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const setPressed = (selector, value, key) => all(selector).forEach((button) => button.setAttribute("aria-pressed", String(button.dataset[key] === value)));
  const setSelected = (selector, value, key) => all(selector).forEach((button) => button.setAttribute("aria-selected", String(button.dataset[key] === value)));

  // Samples are hardcoded local illustrations, never requests to a real cluster.
  const examples = {
    diag: {
      command: "diagnose k8s kube-system",
      context: "kubernetes / demo-rnd",
      lines: [
        ["muted", "core → diagnostics (WASM)"],
        ["muted", "host_call: provider.kubernetes.pods"],
        ["muted", "host_call: provider.kubernetes.events"],
        ["notice", "namespace: kube-system"],
        ["ok", "finding: illustrative read-only snapshot"],
        ["muted", "source: provider responses"]
      ]
    },
    network: {
      command: "network health",
      context: "kubernetes / demo-rnd",
      lines: [
        ["muted", "core → network (WASM)"],
        ["muted", "host_call: provider.kubernetes.nodes"],
        ["notice", "evaluate: Ready / Pressure conditions"],
        ["ok", "findings: demo only"],
        ["muted", "snapshot, not root cause analysis"]
      ]
    },
    plugins: {
      command: "plugins list",
      context: "local runtime / demo",
      lines: [
        ["muted", "loaded plugins (example)"],
        ["notice", "diagnostics     WASM / v2alpha1"],
        ["notice", "network         WASM / v2alpha1"],
        ["muted", "requires build tag: extism"],
        ["ok", "status: ready (illustration)"]
      ]
    }
  };
  let terminalTimers = [];
  let heroTimer;
  let heroExample = "diag";
  let userSelected = false;
  const clearTerminal = () => { terminalTimers.forEach(clearTimeout); terminalTimers = []; };
  function renderTerminal(which, instant = false) {
    const ex = examples[which];
    if (!ex) return;
    heroExample = which;
    setPressed("[data-demo]", which, "demo");
    clearTerminal();
    const body = $("terminal-lines");
    body.replaceChildren();
    $("term-context").textContent = ex.context;
    const showLine = (kind, str) => {
      const line = document.createElement("span");
      line.className = "term-line " + kind;
      line.textContent = str;
      body.append(line);
    };
    showLine("cmd", "support ❯ " + ex.command);
    ex.lines.forEach(([kind, str], i) => {
      if (instant || reduced) showLine(kind, str);
      else terminalTimers.push(setTimeout(() => showLine(kind, str), 270 + i * 245));
    });
  }
  all("[data-demo]").forEach((btn) => btn.addEventListener("click", () => {
    userSelected = true; clearInterval(heroTimer); renderTerminal(btn.dataset.demo);
  }));
  renderTerminal(heroExample);
  if (!reduced) heroTimer = setInterval(() => {
    if (userSelected || document.hidden) return;
    const keys = Object.keys(examples);
    renderTerminal(keys[(keys.indexOf(heroExample) + 1) % keys.length]);
  }, 8500);

  // One core, three real interface adapters. Switch changes this model only.
  const surfaceData = {
    cli: ["CLI / REPL", "Оператор вводит команды в интерактивной оболочке. Контекст выбирается локально в сессии; вывод по умолчанию читабелен как таблица.", "surface: cli", "shell + provider commands"],
    ai: ["Built-in AI", "Необязательная LLM-интеграция выбирает инструменты через Registry. Это экспериментальный адаптер, а не автономный incident-responder.", "surface: agent", "function calling → Registry"],
    mcp: ["MCP stdio", "Внешний MCP-клиент получает только read-инструменты из Registry по локальному stdio JSON-RPC. Remote MCP/HTTP здесь нет.", "surface: mcp", "tools/list → tools/call"]
  };
  function surface(which) {
    const x = surfaceData[which];
    if (!x) return;
    setPressed("[data-surface]", which, "surface");
    $("surface-entry").textContent = x[0];
    $("surface-detail").textContent = x[1];
    $("surface-label").textContent = x[2];
    $("surface-sub").textContent = x[3];
  }
  all("[data-surface]").forEach((b) => b.addEventListener("click", () => surface(b.dataset.surface)));
  surface("cli");

  // Flow focus is a visual step-through, not a captured execution trace.
  const steps = [
    ["01 / Вход", "CLI, встроенный AI или MCP обращаются к одному набору зарегистрированных команд. Здесь выбран демонстрационный пример diagnose k8s kube-system."],
    ["02 / Registry", "Core валидирует входные аргументы и учитывает policy выбранного интерфейса. Разрешение интерфейса не означает разрешение Host-вызова."],
    ["03 / WASM", "Extism вызывает команду diagnostics. Плагин объявил нужные provider capabilities в манифесте support.shell/v2alpha1."],
    ["04 / Host API", "Host допускает вызов, только если capability заявлена модулем и есть в read-only provider allowlist. Credentials остаются в Go-провайдере."],
    ["05 / Результат", "Провайдер возвращает снимок ресурсов; diagnostics формирует структурированное описание. Это не RCA и не доказательство полноценного sandbox."]
  ];
  function focusStep(index) {
    if (!Number.isInteger(index) || !steps[index]) return;
    all("[data-step]").forEach((b) => b.setAttribute("aria-pressed", String(Number(b.dataset.step) === index)));
    $("flow-detail").replaceChildren();
    const head = document.createElement("strong"); head.textContent = steps[index][0];
    const span = document.createElement("span"); span.textContent = steps[index][1];
    $("flow-detail").append(head, span);
  }
  all("[data-step]").forEach((b) => b.addEventListener("click", () => focusStep(Number(b.dataset.step))));
  focusStep(0);

  // Capability model: declared by guest AND granted by read-only Host allowlist.
  const plugins = {
    diagnostics: {
      short: "Диагностика namespace через pods + events.",
      cmd: "diagnose k8s kube-system",
      capabilities: ["provider.kubernetes.pods", "provider.kubernetes.events"],
      description: "Снимок pods и warning events. Findings зависят от полученного снимка; это не автономная диагностика причин."
    },
    network: {
      short: "Проверка NodeStatus: Ready и Pressure.",
      cmd: "network health",
      capabilities: ["provider.kubernetes.nodes"],
      description: "Анализ состояний nodes. Pressure и Ready берутся из одного provider snapshot."
    },
    fixture: {
      short: "Тестовый модуль для MCP/WASM E2E.",
      cmd: "fixture (CI only)",
      capabilities: [],
      description: "Детерминированная фикстура для проверки вызовов. Не отдельный рабочий диагностический плагин."
    }
  };
  let activePlugin = "diagnostics";
  const permittedHostCalls = new Set(["provider.kubernetes.pods", "provider.kubernetes.events", "provider.kubernetes.nodes", "provider.kubernetes.pod.logs"]);
  function selectPlugin(name) {
    const p = plugins[name];
    if (!p) return;
    activePlugin = name;
    setPressed("[data-plugin]", name, "plugin");
    $("plugin-name").textContent = name;
    $("plugin-description").textContent = p.description;
    $("plugin-command").textContent = p.cmd;
    $("plugin-caps").textContent = p.capabilities.join(", ") || "Нет provider capabilities";
    $("cap-plugin").value = name === "fixture" ? "diagnostics" : name;
    updateCapability();
    updateMatrix();
  }
  all("[data-plugin]").forEach((b) => b.addEventListener("click", () => selectPlugin(b.dataset.plugin)));
  function updateCapability() {
    const plugin = $("cap-plugin").value;
    const cap = $("cap-operation").value;
    const requested = plugins[plugin].capabilities.includes(cap);
    const enabled = $("cap-host-grant").checked;
    const allowed = requested && enabled && permittedHostCalls.has(cap);
    $("cap-required").textContent = plugins[plugin].capabilities.join(" · ") || "none";
    const result = $("cap-result");
    result.className = "state " + (allowed ? "yes" : "no");
    result.textContent = allowed ? "ALLOW / read-only Host call" : "DENY / Host call";
    $("cap-rationale").textContent = !requested
      ? "Плагин не объявил эту capability в своём манифесте."
      : !enabled ? "Host grant отключён в локальной модели — вызов заблокирован."
      : !permittedHostCalls.has(cap) ? "Операция отсутствует в read-only allowlist Host."
      : "Capability запрошена, Host grant есть, read-only provider допускает вызов.";
  }
  ["cap-plugin", "cap-operation", "cap-host-grant"].forEach((id) => $(id).addEventListener("change", updateCapability));

  // Simple policy matrix; read tools additionally can be denied per surface.
  // Illustrative availability rather than a guarantee of real credentials or environment.
  const matrixRows = [
    ["Read: nodes", "provider.kubernetes.nodes", "read"],
    ["Read: pods", "provider.kubernetes.pods", "read"],
    ["Read: events", "provider.kubernetes.events", "read"],
    ["Read: pod logs", "provider.kubernetes.pod.logs", "logs"],
    ["Switch context", "connections use", "context"],
    ["Write via WASM/MCP", "mutation", "write"]
  ];
  function matrixCell(kind, surface, capability) {
    if (kind === "context") return surface === "cli" ? ["LOCAL", "scoped"] : ["—", "blocked"];
    if (kind === "write") return ["—", "blocked"];
    if (surface === "mcp" && kind === "logs" && $("deny-logs-mcp").checked) return ["DENIED", "blocked"];
    if (surface === "wasm") return plugins[activePlugin].capabilities.includes(capability)
      ? ["READ", "allowed"] : ["NO GRANT", "blocked"];
    return ["READ", "allowed"];
  }
  function updateMatrix() {
    const tbody = $("permission-body");
    tbody.replaceChildren();
    const surfaces = ["cli", "ai", "mcp", "wasm"];
    matrixRows.forEach(([label,cap,kind]) => {
      const tr = document.createElement("tr");
      const first = document.createElement("td");
      first.textContent = label;
      const id = document.createElement("small"); id.textContent = cap;
      first.append(id);tr.append(first);
      surfaces.forEach(surface => {
        const td = document.createElement("td");
        const [value,status] = matrixCell(kind,surface,cap);
        const span = document.createElement("span");
        span.className = "pill " + status;
        span.textContent = value;
        td.append(span);tr.append(td);
      });
      tbody.append(tr);
    });
  }
  $("deny-logs-mcp").addEventListener("change", updateMatrix);
  selectPlugin(activePlugin);

  // Session context examples are fictional; selecting never modifies kubeconfig.
  const contexts = {
    rnd: { name: "kubernetes/demo-rnd", namespace: "default", note: "Сессионный выбор для интерактивного примера." },
    lab: { name: "kubernetes/demo-lab", namespace: "kube-system", note: "Смена подключения не изменяет глобальный kubeconfig." }
  };
  let currentContext = "rnd";
  function context(which) {
    currentContext = which;
    const x = contexts[which];
    if (!x) return;
    $("ctx-name").textContent = x.name;
    $("ctx-namespace").textContent = x.namespace;
    $("ctx-note").textContent = x.note;
    $("ctx-command").textContent = "connections use " + x.name;
  }
  $("ctx-select").addEventListener("change", (event) => context(event.target.value));
  context("rnd");

  // Three views of identical synthetic data — no infrastructure is accessed.
  const demoNodes = [
    {name: "demo-node-a",ready: true,pressure: false},
    {name: "demo-node-b",ready: false,pressure: true}
  ];
  function outputMode(mode) {
    setSelected("[data-output]", mode, "output");
    const target = $("output-display"); target.replaceChildren();
    if (mode === "table") {
      const table = document.createElement("table");
      table.className = "output-table";
      const thead = document.createElement("thead");
      const trh = document.createElement("tr");
      ["NODE","READY","PRESSURE"].forEach(x=>{const th=document.createElement("th");th.textContent=x;trh.append(th);});
      thead.append(trh); table.append(thead);
      const tbody=document.createElement("tbody");
      demoNodes.forEach(n=>{const tr=document.createElement("tr");[n.name,String(n.ready),String(n.pressure)].forEach(v=>{const td=document.createElement("td");td.textContent=v;tr.append(td)});tbody.append(tr)});
      table.append(tbody);target.append(table);
    } else {
      const pre=document.createElement("pre");pre.className="code";
      pre.textContent=mode==="json"
       ? JSON.stringify({demo:true,source:"synthetic node statuses",nodes:demoNodes},null,2)
       : demoNodes.map(n=>n.name+": Ready="+n.ready+", Pressure="+n.pressure).join("\n");
      target.append(pre);
    }
  }
  all("[data-output]").forEach((b)=>b.addEventListener("click",()=>outputMode(b.dataset.output)));
  outputMode("table");

  // Compare real adapters: CLI, optional AI and implemented stdio MCP.
  const adapterContent = {
    cli: {title:"CLI / direct execution",cmd:"support ❯ network health",text:"Оператор выбирает команду и получает вывод. Инструменты проходят через Registry и выбранное сессионное подключение."},
    ai: {title:"Optional built-in AI",cmd:"Запрос → model tool call → Core Registry",text:"Модель может вызывать опубликованные инструменты в пределах бюджета и policy интерфейса. Ответ модели — гипотеза, а не проверенный факт."},
    mcp: {title:"MCP stdio adapter",cmd:"initialize → tools/list → tools/call",text:"Локальный MCP-процесс публикует read-инструменты. Команды с risk != read не попадают в список; сетевой сервер не реализован."}
  };
  function adapter(which) {
    setPressed("[data-adapter]",which,"adapter");
    const x=adapterContent[which];
    $("adapter-title").textContent=x.title;
    $("adapter-command").textContent=x.cmd;
    $("adapter-description").textContent=x.text;
  }
  all("[data-adapter]").forEach(b=>b.addEventListener("click",()=>adapter(b.dataset.adapter)));
  adapter("mcp");

  // Step-through of a supported diagnostics command, intentionally illustrative.
  const trace = [
    ["Shell", "diagnose k8s kube-system"],
    ["Registry", "policy + input schema"],
    ["WASM", "diagnostics v2alpha1"],
    ["Host", "pods + events read capabilities"],
    ["Provider", "read-only Kubernetes snapshot"],
    ["Output", "structured findings + source"]
  ];
  function traceStep(index) {
    const list=$("trace-timeline");list.replaceChildren();
    trace.forEach(([title,desc],i)=>{
      const item=document.createElement("div");item.className="timeline-item"+(index===i?" active":"");
      const label=document.createElement("strong");label.textContent=String(i+1).padStart(2,"0")+" / "+title;
      const detail=document.createElement("small");detail.textContent=desc;
      item.append(label,detail);list.append(item);
    });
    $("trace-caption").textContent=trace[index][0]+": "+trace[index][1];
    $("trace-range").value=String(index);
  }
  $("trace-range").addEventListener("input",e=>traceStep(Number(e.target.value)));
  traceStep(0);
})();
