import { alertMessages } from "./utilsMessage";

type AlertCategory = keyof typeof alertMessages;

export function utils () {
  function getRandomAlertMessage(category: AlertCategory, name: string = "Alguém") {
    const messages = alertMessages[category];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    return randomMessage.replace("{name}", name);
  }
  return {
    getRandomAlertMessage
  }
}