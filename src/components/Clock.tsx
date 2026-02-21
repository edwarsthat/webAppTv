import { useState, useEffect, useRef } from 'preact/hooks';

const SSE_URL = import.meta.env.PUBLIC_SSE_URL ?? 'http://localhost:3010/events/stream';

function calcularElapsed(inicio: Date): string {
  const diff = Math.max(0, Math.floor((Date.now() - inicio.getTime()) / 1000));
  const h = Math.floor(diff / 3600);
  const m = Math.floor((diff % 3600) / 60);
  const s = diff % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function Clock() {
  const [time, setTime] = useState('--:--:--');
  const inicioRef = useRef<Date | null>(null);

  // Recibe horaInicio desde el snapshot SSE
  useEffect(() => {
    const es = new EventSource(SSE_URL);

    es.addEventListener('snapshot', (e) => {
      try {
        const { horaInicio } = JSON.parse(e.data);
        if (horaInicio) {
          inicioRef.current = new Date(horaInicio);
          setTime(calcularElapsed(inicioRef.current));
        }
      } catch {
        // ignora eventos malformados
      }
    });

    return () => es.close();
  }, []);

  // Contador que se actualiza cada segundo
  useEffect(() => {
    const id = setInterval(() => {
      if (inicioRef.current) {
        setTime(calcularElapsed(inicioRef.current));
      }
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return <div class="televisor-clock">{time}</div>;
}
