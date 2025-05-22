export function utils () {

  function invitePlayers (userName: string, roomName: string, roomId: string): void {
    const message = `${userName} convidou para participar do Planning Poker: ${roomName}!!!\nAcesse https://planingpokerapp.com e insira o ID da sala: ${roomId} ou clique no link direto: https://planingpokerapp.com/room/${roomId}`;

    navigator.clipboard.writeText(message)
    .then(() => {
      console.log('Convite copiado para a área de transferência!');
      alert('Convite copiado! Compartilhe com seus colegas.');
    })
    .catch((err) => {
      console.error('Erro ao copiar convite:', err);
    });
  }

  return {
    invitePlayers
  }
}