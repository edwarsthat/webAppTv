import { useState, useEffect, useRef } from 'preact/hooks';

const SSE_URL = import.meta.env.PUBLIC_SSE_URL ?? 'http://localhost:3010/events/stream';

interface DashboardData {
  procesados: string | number;
  exportacion: string | number;
  predio: string;
  tipoFruta: string;
  rendimiento: string | number;
  procesadosKgh: string | number;
  exportacionKgh: string | number;
}

const initialData: DashboardData = {
  procesados: '----',
  exportacion: '----',
  predio: '_ _ _ _ _',
  tipoFruta: '---',
  rendimiento: '----',
  procesadosKgh: '----',
  exportacionKgh: '----',
};

export default function TvDashboard() {
  const [data, setData] = useState<DashboardData>(initialData);
  const horaInicioRef = useRef<Date | null>(null);
  const kilosProcesadosRef = useRef<number | null>(null);
  const kilosExportacionRef = useRef<number | null>(null);

  // Recalcula kilos/hora cada segundo
  useEffect(() => {
    const intervalo = setInterval(() => {
      if (horaInicioRef.current === null) return;

      const horasTranscurridas = (Date.now() - horaInicioRef.current.getTime()) / 3_600_000;
      if (horasTranscurridas <= 0) return;

      if (kilosProcesadosRef.current !== null) {
        const kgh = (kilosProcesadosRef.current / horasTranscurridas).toFixed(1);
        setData((prev) => ({ ...prev, procesadosKgh: kgh }));
      }

      if (kilosExportacionRef.current !== null) {
        const kgh = (kilosExportacionRef.current / horasTranscurridas).toFixed(1);
        setData((prev) => ({ ...prev, exportacionKgh: kgh }));
      }

      if (kilosProcesadosRef.current !== null && kilosExportacionRef.current !== null && kilosProcesadosRef.current > 0) {
        const rendimiento = ((kilosExportacionRef.current / kilosProcesadosRef.current) * 100).toFixed(1);
        setData((prev) => ({ ...prev, rendimiento: `${rendimiento}%` }));
      }
    }, 1000);

    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    const es = new EventSource(SSE_URL);

    es.addEventListener('conexion', () => {
      console.log('[SSE] Conectado al servidor');
    });

    es.addEventListener('snapshot', (e) => {
      try {
        const { predio, lote, tipoFruta, horaInicio, kilos_procesados, kilos_exportacion } = JSON.parse(e.data);

        if (predio || lote) {
          setData((prev) => ({ ...prev, predio: `${lote} ${predio}`, tipoFruta }));
        }
        if (kilos_procesados != null) {
          kilosProcesadosRef.current = kilos_procesados;
          setData((prev) => ({ ...prev, procesados: kilos_procesados }));
        }
        if (kilos_exportacion != null) {
          kilosExportacionRef.current = kilos_exportacion;
          setData((prev) => ({ ...prev, exportacion: kilos_exportacion }));
        }
        if (horaInicio) {
          horaInicioRef.current = new Date(horaInicio);
        }
      } catch {
        console.warn('[SSE] Error al parsear snapshot');
      }
    });

    es.onerror = () => {
      console.warn('[SSE] Conexión perdida, reconectando...');
    };

    return () => es.close();
  }, []);

  return (
    <div class="televisor-container-data">
      {/* ── Columna izquierda: métricas numéricas ── */}
      <div class="televisor-container-data-numerico">
        <div class="metric-box">
          <span class="metric-label">PROCESADOS</span>
          <span class="metric-value">{data.procesados}</span>
        </div>
        <div class="metric-box">
          <span class="metric-label">EXPORTACION</span>
          <span class="metric-value">{data.exportacion}</span>
        </div>
        <div class="metric-box">
          <span class="metric-label">PREDIO</span>
          <span class="metric-value">{data.predio}</span>
        </div>
      </div>

      {/* ── Columna derecha ── */}
      <div class="televisor-container-data-metas">
        <div class="meta-item">
          <span class="meta-label">PROCESADOS KG/H</span>
          <span class="meta-value">{data.procesadosKgh}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">EXPORTACION KG/H</span>
          <span class="meta-value">{data.exportacionKgh}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">RENDIMIENTO</span>
          <span class="meta-value">{data.rendimiento}</span>
        </div>
      </div>
    </div>
  );
}
