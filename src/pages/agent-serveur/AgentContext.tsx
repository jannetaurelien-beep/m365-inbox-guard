import { createContext, useContext, useState, ReactNode, useMemo } from "react";
import { mockAgents } from "./mock";

export type AgentCapability = "ad" | "dns" | "dhcp" | "files" | "server" | "gpo";

export type Agent = (typeof mockAgents)[number] & { capabilities: AgentCapability[] };

// Capacités déduites du rôle de la machine
function capabilitiesFor(role: string, hostname: string): AgentCapability[] {
  const caps: AgentCapability[] = ["server"];
  if (role.includes("Contrôleur")) caps.push("ad", "dns", "gpo");
  if (hostname.includes("DHCP")) caps.push("dhcp");
  if (hostname.includes("FILE")) caps.push("files");
  if (role === "Serveur membre" && !hostname.includes("DHCP") && !hostname.includes("FILE")) {
    caps.push("files");
  }
  return caps;
}

export const enrichedAgents: Agent[] = mockAgents.map((a) => ({
  ...a,
  capabilities: capabilitiesFor(a.role, a.hostname),
}));

type Ctx = {
  agent: Agent;
  setAgentId: (id: string) => void;
  agents: Agent[];
  hasCapability: (cap: AgentCapability) => boolean;
};

const AgentContext = createContext<Ctx | null>(null);

export function AgentProvider({ children }: { children: ReactNode }) {
  const [agentId, setAgentId] = useState(enrichedAgents[0].id);
  const agent = useMemo(() => enrichedAgents.find((a) => a.id === agentId) ?? enrichedAgents[0], [agentId]);
  const hasCapability = (cap: AgentCapability) => agent.capabilities.includes(cap);
  return (
    <AgentContext.Provider value={{ agent, setAgentId, agents: enrichedAgents, hasCapability }}>
      {children}
    </AgentContext.Provider>
  );
}

export function useAgent() {
  const ctx = useContext(AgentContext);
  if (!ctx) throw new Error("useAgent must be used inside AgentProvider");
  return ctx;
}
