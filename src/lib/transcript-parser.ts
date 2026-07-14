export interface MessageTurn {
  sender: "human" | "agent" | "unknown";
  senderLabel: string;
  content: string;
}

export const parseTranscript = (text: string): MessageTurn[] => {
  if (!text) return [];

  // Split by newlines (handles both literal and escaped newlines)
  const lines = text.split(/\n|\\n/);
  const turns: MessageTurn[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Checks for standard speaker match, e.g. [AI Agent]: or [Human (Busy Customer)]:
    const match = trimmed.match(/^\[([^\]]+)\]:\s*(.*)$/);
    if (match) {
      const senderLabel = match[1];
      const content = match[2];
      const isHuman = senderLabel.toLowerCase().includes("human");
      const isAgent = senderLabel.toLowerCase().includes("ai") || senderLabel.toLowerCase().includes("agent");

      turns.push({
        sender: isHuman ? "human" : isAgent ? "agent" : "unknown",
        senderLabel,
        content
      });
    } else {
      // Append content to the previous turn if it's a multi-line continuation
      if (turns.length > 0) {
        turns[turns.length - 1].content += "\n" + trimmed;
      } else {
        turns.push({
          sender: "unknown",
          senderLabel: "",
          content: trimmed
        });
      }
    }
  }

  return turns;
};
