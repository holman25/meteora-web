export default function useTour() {
  let drv = null;

  const BASE_STEPS = [
    { element: '#btn-new-convo', popover: { title: 'Nueva conversación', description: 'Crea un chat limpio para empezar.', position: 'right' } },
    { element: '#sidebar-chats', popover: { title: 'Recientes', description: 'Aquí verás tus conversaciones anteriores.', position: 'right' } },
    { element: '#chat-window',   popover: { title: 'Conversación', description: 'Mensajes y respuestas de Meteora.', position: 'left' } },
    { element: '#chat-input',    popover: { title: 'Escribe aquí', description: 'Envía tu pregunta a Meteora.', position: 'top' } },
  ];

  const MOBILE_EXTRA = [
    { element: '#sidebar-mobile', popover: { title: 'Menú', description: 'Abre aquí tus conversaciones en móvil.', position: 'right' } },
  ];

  function buildSteps() {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const pool = isMobile ? [...MOBILE_EXTRA, ...BASE_STEPS] : BASE_STEPS;
    return pool.filter(s => !s.element || document.querySelector(s.element));
  }

  function waitForTargets(maxWaitMs = 800, intervalMs = 60) {
    return new Promise((resolve) => {
      const start = performance.now();
      const tick = () => {
        const steps = buildSteps();
        if (steps.length > 0 || performance.now() - start > maxWaitMs) resolve(steps);
        else setTimeout(tick, intervalMs);
      };
      tick();
    });
  }

  async function startTour({ onFinish } = {}) {
    const { driver } = await import('driver.js');
    await import('driver.js/dist/driver.css');

    const steps = await waitForTargets();

    steps.push({
      popover: {
        title: '¡Listo!',
        description: 'Ya conoces lo básico. ¿Deseas regresar al inicio?',
        position: 'center',
        nextBtnText: '¡Sí, vamos a ello! 🚀',
        onNextClick: () => {
          try { drv?.destroy(); } catch {}
          onFinish && onFinish();
        },
      },
    });

    drv = driver({
      showProgress: true,
      nextBtnText: 'Siguiente',
      prevBtnText: 'Atrás',
      doneBtnText: '¡Vamos con ello! 🚀',
      overlayOpacity: 0.5,
      stageRadius: 10,
      allowClose: true,
      animate: true,
      smoothScroll: true,
      zIndex: 99999,
      onDestroyed: () => { /* hook opcional */ },
    });

    drv.setSteps(steps);
    drv.drive();
  }

  return { startTour };
}
