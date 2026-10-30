import React, { useState, useMemo } from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

/**
 * Friendly 24-Hour Circadian Energy Curve Chart (Light Wellness Theme).
 * Visualizes diurnal alertness levels using soft sage and soft blue palette with clear, plain-English labels.
 */
export default function EnergyCurveChart({ hourlyData = [] }) {
  const [hoverIndex, setHoverIndex] = useState(null);

  // SVG dimensions & coordinate space
  const svgWidth = 800;
  const svgHeight = 280;
  const padding = { top: 30, right: 30, bottom: 45, left: 45 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  // Simplify phase names to friendly everyday English
  const getFriendlyPhaseName = (phase) => {
    if (!phase) return 'Active Day';
    const lower = phase.toLowerCase();
    if (lower.includes('peak')) return 'Best Focus Time';
    if (lower.includes('dip')) return 'Afternoon Energy Dip';
    if (lower.includes('recovery')) return 'Energy Recovery';
    if (lower.includes('wind')) return 'Evening Wind-Down';
    if (lower.includes('sleep')) return 'Sleep Time';
    if (lower.includes('awakening') || lower.includes('morning')) return 'Morning Energy';
    return phase;
  };

  // Generate fallback data if none provided (24 hours)
  const data = useMemo(() => {
    if (hourlyData && hourlyData.length === 24) return hourlyData;
    const fallback = [];
    for (let h = 0; h < 24; h++) {
      let energy = 50;
      let phase = 'Active Day';
      if (h >= 23 || h < 7) {
        energy = 15;
        phase = 'Sleep Time';
      } else if (h >= 9 && h <= 13) {
        energy = 90;
        phase = 'Best Focus Time';
      } else if (h >= 14 && h <= 16) {
        energy = 55;
        phase = 'Afternoon Energy Dip';
      } else if (h >= 17 && h <= 20) {
        energy = 80;
        phase = 'Energy Recovery';
      } else {
        energy = 40;
        phase = 'Evening Wind-Down';
      }
      fallback.push({
        hour: h,
        timeLabel: `${h % 12 === 0 ? 12 : h % 12}:00 ${h < 12 ? 'AM' : 'PM'}`,
        energyLevel: energy,
        phase: phase,
        suggestedFocus: 'Everyday Activity',
      });
    }
    return fallback;
  }, [hourlyData]);

  // Map data points to SVG coordinates
  const points = useMemo(() => {
    return data.map((d, i) => {
      const x = padding.left + (i / 23) * graphWidth;
      const y = padding.top + graphHeight - (d.energyLevel / 100) * graphHeight;
      return {
        x,
        y,
        ...d,
        friendlyPhase: getFriendlyPhaseName(d.phase),
      };
    });
  }, [data, graphWidth, graphHeight, padding.left, padding.top]);

  // Build smooth cubic Bezier curve path
  const curvePath = useMemo(() => {
    if (points.length === 0) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? i : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  }, [points]);

  // Area path closing down to zero
  const areaPath = useMemo(() => {
    if (points.length === 0) return '';
    const bottomY = padding.top + graphHeight;
    return `${curvePath} L ${points[points.length - 1].x} ${bottomY} L ${points[0].x} ${bottomY} Z`;
  }, [curvePath, points, padding.top, graphHeight]);

  const activePoint = hoverIndex !== null ? points[hoverIndex] : null;

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8E3',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 2,
              backgroundColor: '#E5F0EA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BoltOutlinedIcon sx={{ color: '#5B8C7A', fontSize: 20 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#334155', fontSize: '1.05rem' }}>
            Your 24-Hour Daily Energy Pattern
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: '#64748B' }}>
          Move your cursor or touch along the curve to see hourly estimates
        </Typography>
      </Box>

      {/* SVG Chart */}
      <Box sx={{ width: '100%', position: 'relative' }}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ width: '100%', height: 'auto', display: 'block' }}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            {/* Linear gradient for area fill in soft sage and light blue */}
            <linearGradient id="wellnessEnergyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5B8C7A" stopOpacity="0.32" />
              <stop offset="50%" stopColor="#DCEBEF" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#F5F7F2" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Background Grid Lines (Horizontal) */}
          {[25, 50, 75, 100].map((level) => {
            const y = padding.top + graphHeight - (level / 100) * graphHeight;
            return (
              <g key={level}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + graphWidth}
                  y2={y}
                  stroke="#E2E8E3"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  fill="#94A3B8"
                  fontSize="10"
                  fontFamily="Inter, sans-serif"
                >
                  {level}%
                </text>
              </g>
            );
          })}

          {/* Area under curve */}
          <path d={areaPath} fill="url(#wellnessEnergyGradient)" />

          {/* Main Smooth Line */}
          <path
            d={curvePath}
            fill="none"
            stroke="#5B8C7A"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* X Axis Time Labels (Every 3 hours) */}
          {[0, 3, 6, 9, 12, 15, 18, 21].map((h) => {
            const pt = points[h];
            if (!pt) return null;
            return (
              <g key={h}>
                <line
                  x1={pt.x}
                  y1={padding.top + graphHeight}
                  x2={pt.x}
                  y2={padding.top + graphHeight + 6}
                  stroke="#CBD5E1"
                />
                <text
                  x={pt.x}
                  y={padding.top + graphHeight + 20}
                  textAnchor="middle"
                  fill="#64748B"
                  fontSize="10"
                  fontFamily="Inter, sans-serif"
                  fontWeight="500"
                >
                  {pt.timeLabel}
                </text>
              </g>
            );
          })}

          {/* Invisible interactive hover columns */}
          {points.map((pt, i) => {
            const colWidth = graphWidth / 24;
            return (
              <rect
                key={i}
                x={pt.x - colWidth / 2}
                y={padding.top}
                width={colWidth}
                height={graphHeight}
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoverIndex(i)}
                onTouchStart={() => setHoverIndex(i)}
              />
            );
          })}

          {/* Active Hover Marker & Guide Line */}
          {activePoint && (
            <g>
              <line
                x1={activePoint.x}
                y1={padding.top}
                x2={activePoint.x}
                y2={padding.top + graphHeight}
                stroke="#5B8C7A"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="6"
                fill="#5B8C7A"
                stroke="#FFFFFF"
                strokeWidth="2.5"
              />
            </g>
          )}
        </svg>

        {/* Hover Information Card */}
        {activePoint ? (
          <Box
            sx={{
              mt: 1.5,
              p: 2,
              borderRadius: 2.5,
              backgroundColor: '#F5F7F2',
              border: '1px solid #E2E8E3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 1.5,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Chip
                label={activePoint.timeLabel}
                size="small"
                sx={{
                  backgroundColor: '#5B8C7A',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                }}
              />
              <Typography variant="body2" sx={{ color: '#334155', fontWeight: 600 }}>
                Phase: <span style={{ color: '#456B5D' }}>{activePoint.friendlyPhase}</span>
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Typography variant="body2" sx={{ color: '#64748B' }}>
                Estimated Alertness: <strong style={{ color: '#334155' }}>{activePoint.energyLevel}%</strong>
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B', fontStyle: 'italic' }}>
                Helpful Activity: {activePoint.suggestedFocus}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              mt: 1.5,
              p: 1.2,
              textAlign: 'center',
              borderRadius: 2,
              backgroundColor: '#F5F7F2',
            }}
          >
            <Typography variant="caption" sx={{ color: '#64748B' }}>
              Hover along the curve above to see your estimated energy for each hour of the day.
            </Typography>
          </Box>
        )}
      </Box>

      {/* Legend */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: { xs: 1.5, sm: 3 },
          mt: 2.5,
          pt: 1.5,
          borderTop: '1px solid #E2E8E3',
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#5B8C7A' }} />
          <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.8rem', fontWeight: 500 }}>
            Best Focus Time (~80–95%)
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#D97706' }} />
          <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.8rem', fontWeight: 500 }}>
            Afternoon Energy Dip (~50–60%)
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#0284C7' }} />
          <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.8rem', fontWeight: 500 }}>
            Energy Recovery (~70–85%)
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#94A3B8' }} />
          <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.8rem', fontWeight: 500 }}>
            Sleep & Wind-Down
          </Typography>
        </Box>
      </Box>

      {/* Required Clarification Note */}
      <Box
        sx={{
          mt: 2,
          p: 1.5,
          borderRadius: 2,
          backgroundColor: '#F5F7F2',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1,
        }}
      >
        <InfoOutlinedIcon sx={{ color: '#64748B', fontSize: 18, mt: 0.2 }} />
        <Typography variant="caption" sx={{ color: '#64748B', lineHeight: 1.5 }}>
          This curve is an estimate of how your alertness may change throughout the day based on your answers. It is not a direct measurement of your brain activity or body clock.
        </Typography>
      </Box>
    </Paper>
  );
}
