/**
 * TvDashboard — isla Preact que muestra las métricas y la meta del día.
 *
 * Props:
 *   metrics  → array de { label, value } para la columna izquierda
 *   meta     → valor numérico/string para la columna de metas
 *   metaLabel → etiqueta de la columna de metas (por defecto "META")
 *
 * Aquí puedes añadir tu lógica de fetch/websocket para actualizar los datos.
 */

import { useState } from 'preact/hooks';

export interface Metric {
  label: string;
  value: string | number;
}

export interface TvDashboardProps {
  metrics?: Metric[];
  rendimiento?: string | number;
  procesadosKgh?: string | number;
  exportacionKgh?: string | number;
}

const defaultMetrics: Metric[] = [
  { label: 'PROCESADOS', value: '0000' },
  { label: 'EXPORTACION', value: '00000' },
  { label: 'PREDIO', value: ' _ _ _ _ _ ' },
];

export default function TvDashboard({
  metrics = defaultMetrics,
  rendimiento = '0000',
  procesadosKgh = '0000',
  exportacionKgh = '0000',
}: TvDashboardProps) {
  return (
    <div class="televisor-container-data">
      {/* ── Columna izquierda: métricas numéricas ── */}
      <div class="televisor-container-data-numerico">
        {metrics.map((m) => (
          <div key={m.label} class="metric-box">
            <span class="metric-label">{m.label}</span>
            <span class="metric-value">{m.value}</span>
          </div>
        ))}
      </div>

      {/* ── Columna derecha: rendimiento y kg/h ── */}
      <div class="televisor-container-data-metas">
        <div class="meta-item">
          <span class="meta-label">RENDIMIENTO</span>
          <span class="meta-value">{rendimiento}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">PROCESADOS KG/H</span>
          <span class="meta-value">{procesadosKgh}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">EXPORTACION KG/H</span>
          <span class="meta-value">{exportacionKgh}</span>
        </div>
      </div>
    </div>
  );
}
