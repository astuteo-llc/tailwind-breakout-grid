/**
 * Breakout Grid Visualizer - Template
 * The HTML template string for the visualizer UI
 */

export const template = `
  <div x-show="isVisible"
       x-transition
       class="breakout-grid-visualizer"
       @mousemove.window="onColumnResize($event)"
       @mouseup.window="stopColumnResize()"
       style="position: fixed; inset: 0; pointer-events: none; z-index: 9999;">

    <!-- Advanced Span Examples Overlay -->
    <div x-show="showAdvanced"
         class="grid-cols-breakout"
         style="position: absolute; inset: 0; height: 100%; pointer-events: auto; z-index: 5;">

      <!-- Left-anchored: full-start to feature-end -->
      <div style="grid-column: full-start / feature-end;
                  background: linear-gradient(135deg, rgba(236, 72, 153, 0.25) 0%, rgba(139, 92, 246, 0.25) 100%);
                  border: 3px solid rgb(168, 85, 247);
                  margin: 1rem 0;
                  padding: 1rem;
                  display: flex;
                  align-items: center;
                  justify-content: flex-start;
                  transition: background 0.2s ease;"
           onmouseenter="this.style.background='linear-gradient(135deg, rgba(236, 72, 153, 0.6) 0%, rgba(139, 92, 246, 0.6) 100%)'"
           onmouseleave="this.style.background='linear-gradient(135deg, rgba(236, 72, 153, 0.25) 0%, rgba(139, 92, 246, 0.25) 100%)'">
        <div style="background: rgb(139, 92, 246);
                    color: white;
                    padding: 0.75rem 1rem;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-align: left;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="font-family: monospace; margin-bottom: 0.25rem;">.col-feature-left</div>
          <div style="font-size: 0.625rem; opacity: 0.9; font-weight: 500;">Left edge → feature boundary</div>
        </div>
      </div>

      <!-- Right-anchored: feature-start to full-end -->
      <div style="grid-column: feature-start / full-end;
                  background: linear-gradient(135deg, rgba(34, 197, 94, 0.25) 0%, rgba(59, 130, 246, 0.25) 100%);
                  border: 3px solid rgb(34, 197, 94);
                  margin: 1rem 0;
                  padding: 1rem;
                  display: flex;
                  align-items: center;
                  justify-content: flex-end;
                  transition: background 0.2s ease;"
           onmouseenter="this.style.background='linear-gradient(135deg, rgba(34, 197, 94, 0.6) 0%, rgba(59, 130, 246, 0.6) 100%)'"
           onmouseleave="this.style.background='linear-gradient(135deg, rgba(34, 197, 94, 0.25) 0%, rgba(59, 130, 246, 0.25) 100%)'">
        <div style="background: rgb(34, 197, 94);
                    color: white;
                    padding: 0.75rem 1rem;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-align: right;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="font-family: monospace; margin-bottom: 0.25rem;">.col-feature-right</div>
          <div style="font-size: 0.625rem; opacity: 0.9; font-weight: 500;">Feature boundary → right edge</div>
        </div>
      </div>

      <!-- To center point: full-start to center-end -->
      <div style="grid-column: full-start / center-end;
                  background: linear-gradient(135deg, rgba(251, 146, 60, 0.25) 0%, rgba(234, 179, 8, 0.25) 100%);
                  border: 3px solid rgb(234, 179, 8);
                  margin: 1rem 0;
                  padding: 1rem;
                  display: flex;
                  align-items: center;
                  justify-content: flex-end;
                  transition: background 0.2s ease;"
           onmouseenter="this.style.background='linear-gradient(135deg, rgba(251, 146, 60, 0.6) 0%, rgba(234, 179, 8, 0.6) 100%)'"
           onmouseleave="this.style.background='linear-gradient(135deg, rgba(251, 146, 60, 0.25) 0%, rgba(234, 179, 8, 0.25) 100%)'">
        <div style="background: rgb(234, 179, 8);
                    color: white;
                    padding: 0.75rem 1rem;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-align: right;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="font-family: monospace; margin-bottom: 0.25rem;">.col-center-left</div>
          <div style="font-size: 0.625rem; opacity: 0.9; font-weight: 500;">Left edge → center point</div>
        </div>
      </div>

      <!-- Nested grid example: breakout-to-feature inside col-feature -->
      <div style="grid-column: feature;
                  border: 3px dashed rgb(59, 130, 246);
                  margin: 1rem 0;
                  background: rgba(59, 130, 246, 0.05);
                  transition: background 0.2s ease;
                  padding: 0.5rem;"
           onmouseenter="this.style.background='rgba(59, 130, 246, 0.3)'"
           onmouseleave="this.style.background='rgba(59, 130, 246, 0.05)'">
        <div style="font-size: 0.625rem; font-family: monospace; color: rgb(30, 64, 175); margin-bottom: 0.5rem; padding: 0.25rem;">
          Parent: .col-feature container
        </div>
        <div class="grid-cols-breakout breakout-to-feature"
             style="background: rgba(59, 130, 246, 0.1);">
          <div style="grid-column: feature;
                      background: rgba(59, 130, 246, 0.3);
                      padding: 0.5rem;
                      font-size: 0.625rem;
                      font-family: monospace;
                      color: rgb(30, 64, 175);">
            .col-feature → fills container
          </div>
          <div style="grid-column: content;
                      background: rgb(59, 130, 246);
                      color: white;
                      padding: 0.75rem 1rem;
                      font-size: 0.75rem;
                      font-weight: 700;
                      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <div style="font-family: monospace; margin-bottom: 0.5rem;">.col-content → has margins</div>
            <div style="font-size: 0.625rem; opacity: 0.9; font-weight: 500; margin-bottom: 0.75rem;">breakout-to-feature collapses outer tracks</div>
            <pre style="font-size: 0.5rem; background: rgba(0,0,0,0.2); padding: 0.5rem; margin: 0; white-space: pre-wrap; text-align: left;">&lt;div class="col-feature"&gt;
  &lt;div class="grid-cols-breakout breakout-to-feature"&gt;
    &lt;div class="col-feature"&gt;Fills container&lt;/div&gt;
    &lt;p class="col-content"&gt;Has margins&lt;/p&gt;
  &lt;/div&gt;
&lt;/div&gt;</pre>
          </div>
        </div>
      </div>

      <!-- Subgrid example: child aligns to parent grid tracks -->
      <div style="grid-column: feature-start / full-end;
                  display: grid;
                  grid-template-columns: subgrid;
                  border: 3px solid rgb(236, 72, 153);
                  margin: 1rem 0;
                  background: rgba(236, 72, 153, 0.05);
                  transition: background 0.2s ease;"
           onmouseenter="this.style.background='rgba(236, 72, 153, 0.15)'"
           onmouseleave="this.style.background='rgba(236, 72, 153, 0.05)'">
        <!-- Parent label -->
        <div style="grid-column: 1 / -1;
                    font-size: 0.625rem;
                    font-family: monospace;
                    color: rgb(157, 23, 77);
                    padding: 0.5rem;
                    background: rgba(236, 72, 153, 0.1);">
          Parent: .col-feature-right .grid-cols-breakout-subgrid
        </div>
        <!-- Child spanning feature (wider, lighter) -->
        <div style="grid-column: feature;
                    background: rgba(236, 72, 153, 0.3);
                    padding: 0.5rem;
                    margin: 0.5rem 0;
                    font-size: 0.625rem;
                    font-family: monospace;
                    color: rgb(157, 23, 77);">
          Child: .col-feature (aligns to feature area)
        </div>
        <!-- Child using subgrid to align to content (darker) -->
        <div style="grid-column: content;
                    background: rgb(236, 72, 153);
                    color: white;
                    padding: 0.75rem 1rem;
                    margin: 0.5rem 0;
                    font-size: 0.75rem;
                    font-weight: 700;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="font-family: monospace; margin-bottom: 0.5rem;">Child: .col-content</div>
          <div style="font-size: 0.625rem; opacity: 0.9; font-weight: 500; margin-bottom: 0.75rem;">Subgrid lets children align to parent's named lines</div>
          <pre style="font-size: 0.5rem; background: rgba(0,0,0,0.2); padding: 0.5rem; margin: 0; white-space: pre-wrap; text-align: left;">&lt;div class="col-feature-right grid-cols-breakout-subgrid"&gt;
  &lt;div class="col-feature"&gt;Aligns to feature!&lt;/div&gt;
  &lt;div class="col-content"&gt;Aligns to content!&lt;/div&gt;
&lt;/div&gt;</pre>
          <div style="margin-top: 0.75rem;">
            <a href="https://caniuse.com/css-subgrid" target="_blank" rel="noopener" style="display: inline-block; background: rgba(255,255,255,0.2); color: white; text-decoration: none; padding: 0.375rem 0.75rem; border-radius: 0.25rem; font-size: 0.625rem; font-weight: 600; border: 1px solid rgba(255,255,255,0.3);">Check browser support</a>
            <span style="font-size: 0.5rem; opacity: 0.7; margin-left: 0.5rem;">(~90% as of Jan 2025)</span>
          </div>
        </div>
      </div>

    </div>

    <!-- Grid Overlay (hidden in Advanced mode) -->
    <div x-show="!showAdvanced" x-init="$watch('isVisible', v => v && setTimeout(() => updateColumnWidths(), 50)); setTimeout(() => updateColumnWidths(), 100)" class="grid-cols-breakout breakout-visualizer-grid" style="height: 100%; position: relative;">
      <template x-for="area in gridAreas" :key="area.name">
        <div :class="'col-' + area.name"
             @click="selectArea(area.name)"
             @mouseenter="hoveredArea = area.name"
             @mouseleave="hoveredArea = null"
             :style="{
               backgroundColor: (hoveredArea === area.name || isSelected(area.name)) ? area.color.replace('0.25', '0.6') : area.color,
               borderLeft: '1px solid ' + area.borderColor,
               borderRight: '1px solid ' + area.borderColor,
               position: 'relative',
               height: '100%',
               pointerEvents: 'auto',
               cursor: 'pointer',
               transition: 'background-color 0.2s'
             }">

          <!-- Label (centered) -->
          <div x-show="showLabels"
               :style="{
                 position: 'absolute',
                 top: '50%',
                 left: '50%',
                 transform: 'translate(-50%, -50%)',
                 backgroundColor: area.borderColor,
                 color: 'white',
                 padding: '0.75rem 1rem',
                 borderRadius: '0.375rem',
                 fontSize: '0.75rem',
                 fontWeight: '600',
                 textTransform: 'uppercase',
                 letterSpacing: '0.05em',
                 whiteSpace: 'nowrap',
                 boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                 opacity: isSelected(area.name) ? '1' : '0.8',
                 textAlign: 'center',
                 zIndex: '10'
               }">
            <div x-text="area.label"></div>
            <div x-show="showClassNames"
                 :style="{
              fontSize: '0.625rem',
              fontWeight: '500',
              textTransform: 'none',
              marginTop: '0.25rem',
              opacity: '0.9',
              fontFamily: 'monospace'
            }" x-text="area.className"></div>
            <div x-show="columnWidths[area.name] > 0"
                 :style="{
              fontSize: '0.625rem',
              fontWeight: '600',
              textTransform: 'none',
              marginTop: '0.25rem',
              opacity: '0.75',
              fontFamily: 'monospace',
              backgroundColor: 'rgba(0,0,0,0.2)',
              padding: '0.125rem 0.375rem',
              borderRadius: '0.25rem'
            }" x-text="columnWidths[area.name] + 'px'"></div>
          </div>

          <!-- Lorem Ipsum Content (behind label) -->
          <div x-show="showLoremIpsum"
               :style="{
                 position: 'absolute',
                 inset: '0',
                 padding: showGapPadding ? 'var(--gap)' : (showBreakoutPadding ? 'var(--breakout-padding)' : '1.5rem 0'),
                 boxSizing: 'border-box',
                 overflow: 'hidden',
                 whiteSpace: 'pre-line',
                 fontSize: '1.125rem',
                 lineHeight: '1.75',
                 color: 'white',
                 textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                 zIndex: '1'
               }" x-text="loremContent"></div>

          <!-- p-gap / px-gap Padding Overlay -->
          <div x-show="showGapPadding"
               :style="{
                 position: 'absolute',
                 inset: 'var(--gap)',
                 border: '2px dotted ' + area.borderColor,
                 backgroundColor: area.color.replace('0.1', '0.2'),
                 pointerEvents: 'none',
                 zIndex: '10'
               }">
            <div :style="{
              position: 'absolute',
              top: '0.5rem',
              left: '0.5rem',
              fontSize: '0.625rem',
              fontWeight: '700',
              color: area.borderColor,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              backgroundColor: 'white',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }">p-gap</div>
          </div>

          <!-- p-breakout / px-breakout Padding Overlay -->
          <div x-show="showBreakoutPadding"
               :style="{
                 position: 'absolute',
                 inset: 'var(--breakout-padding)',
                 border: '3px dashed ' + area.borderColor,
                 backgroundColor: area.color.replace('0.1', '0.25'),
                 pointerEvents: 'none',
                 zIndex: '10'
               }">
            <div :style="{
              position: 'absolute',
              top: '0.5rem',
              left: '0.5rem',
              fontSize: '0.625rem',
              fontWeight: '700',
              color: area.borderColor,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              backgroundColor: 'white',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }">p-breakout</div>
          </div>

          <!-- Drag Handle - Left (edit mode only, for resizable columns) -->
          <div x-show="editMode && hoveredArea === area.name && getResizeConfig(area.name)"
               @mousedown.stop="startColumnResize($event, getResizeConfig(area.name))"
               :style="{
                 position: 'absolute',
                 left: '-4px',
                 top: '0',
                 width: '16px',
                 height: '100%',
                 cursor: 'ew-resize',
                 pointerEvents: 'auto',
                 zIndex: '100',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center'
               }">
            <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
              <div :style="{
                width: '10px',
                height: '100px',
                background: area.borderColor,
                borderRadius: '5px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                border: '2px solid white'
              }"></div>
              <div :style="{
                background: area.borderColor,
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: '700',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }" x-text="area.name === 'content' ? '← min' : '↔'"></div>
            </div>
          </div>

          <!-- Content Min/Base/Max Visual Guides with integrated handles (edit mode only) -->
          <template x-if="editMode && area.name === 'content'">
            <div style="position: absolute; inset: 0; pointer-events: none; z-index: 50; overflow: visible;">
              <!-- Max boundary (outer, dotted) with drag handle - can overflow to show full width -->
              <div :style="{
                position: 'absolute',
                top: '0',
                bottom: '0',
                left: '50%',
                transform: 'translateX(-50%)',
                width: editValues.contentMax || configOptions.contentMax.value,
                border: '3px dotted rgba(139, 92, 246, 0.9)',
                boxSizing: 'border-box',
                background: 'rgba(139, 92, 246, 0.05)'
              }">
                <div style="position: absolute; top: 8px; right: 8px; background: rgba(139, 92, 246, 0.95); color: white; padding: 3px 8px; border-radius: 3px; font-size: 10px; font-weight: 700;">
                  max: <span x-text="editValues.contentMax || configOptions.contentMax.value"></span>
                </div>
                <!-- Max drag handle on right edge, at top - show on hover or when selected -->
                <div x-show="hoveredArea === 'content' || selectedArea === 'content'"
                     @mousedown.stop="startColumnResize($event, 'contentMax')"
                     style="position: absolute; right: -8px; top: 8px; width: 16px; height: 60px; cursor: ew-resize; pointer-events: auto; display: flex; align-items: center; justify-content: center;">
                  <div style="width: 8px; height: 100%; background: rgb(139, 92, 246); border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.4); border: 2px solid white;"></div>
                </div>
              </div>
              <!-- Base boundary (middle, solid) - half height, inset, can overflow -->
              <div :style="{
                position: 'absolute',
                top: '25%',
                bottom: '25%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: editValues.contentBase || configOptions.contentBase.value,
                border: '3px solid rgba(236, 72, 153, 1)',
                background: 'rgba(236, 72, 153, 0.5)',
                boxSizing: 'border-box',
                borderRadius: '4px'
              }">
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(236, 72, 153, 0.95); color: white; padding: 3px 8px; border-radius: 3px; font-size: 10px; font-weight: 700; white-space: nowrap;">
                  base: <span x-text="editValues.contentBase || configOptions.contentBase.value"></span>
                </div>
                <!-- Base drag handle on right edge - show on hover or when selected -->
                <div x-show="hoveredArea === 'content' || selectedArea === 'content'"
                     @mousedown.stop="startColumnResize($event, 'contentBase')"
                     style="position: absolute; right: -8px; top: 50%; transform: translateY(-50%); width: 16px; height: 40px; cursor: ew-resize; pointer-events: auto; display: flex; align-items: center; justify-content: center;">
                  <div style="width: 8px; height: 100%; background: rgb(236, 72, 153); border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.4); border: 2px solid white;"></div>
                </div>
              </div>
              <!-- Min boundary (inner, dashed) with drag handle - can overflow to show full width -->
              <div :style="{
                position: 'absolute',
                top: '0',
                bottom: '0',
                left: '50%',
                transform: 'translateX(-50%)',
                width: editValues.contentMin || configOptions.contentMin.value,
                border: '3px dashed rgba(168, 85, 247, 0.9)',
                background: 'rgba(168, 85, 247, 0.15)',
                boxSizing: 'border-box'
              }">
                <div style="position: absolute; top: 8px; left: 8px; background: rgba(168, 85, 247, 0.95); color: white; padding: 3px 8px; border-radius: 3px; font-size: 10px; font-weight: 700;">
                  min: <span x-text="editValues.contentMin || configOptions.contentMin.value"></span>
                </div>
                <!-- Min drag handle on left edge, at top - show on hover or when selected -->
                <div x-show="hoveredArea === 'content' || selectedArea === 'content'"
                     @mousedown.stop="startColumnResize($event, 'contentMin')"
                     style="position: absolute; left: -8px; top: 8px; width: 16px; height: 60px; cursor: ew-resize; pointer-events: auto; display: flex; align-items: center; justify-content: center;">
                  <div style="width: 8px; height: 100%; background: rgb(168, 85, 247); border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.4); border: 2px solid white;"></div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </template>
    </div>


    <!-- Control Panel - Ubiquiti-style -->
    <div :style="{
           position: 'fixed',
           bottom: '12px',
           right: '12px',
           pointerEvents: 'auto',
           background: '#f7f7f7',
           borderRadius: '8px',
           boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
           width: '200px',
           fontFamily: 'system-ui, -apple-system, sans-serif',
           zIndex: '10000',
           overflow: 'hidden'
         }">

      <!-- Header -->
      <div @dblclick="controlPanelCollapsed = !controlPanelCollapsed"
           style="padding: 8px 12px; background: #1a1a2e; color: white; display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-weight: 600; font-size: 12px;">Grid</span>
          <span style="font-size: 10px; color: rgba(255,255,255,0.5);" x-text="version"></span>
          <span x-show="controlPanelCollapsed" style="font-size: 10px; color: rgba(255,255,255,0.4);">...</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 11px; font-variant-numeric: tabular-nums; color: rgba(255,255,255,0.7);" x-text="viewportWidth + 'px'"></span>
          <button @click.stop="toggle()" style="background: transparent; border: none; color: rgba(255,255,255,0.6); cursor: pointer; font-size: 16px; line-height: 1; padding: 0;">&times;</button>
        </div>
      </div>

      <!-- Collapsible Content -->
      <div x-show="!controlPanelCollapsed">
      <!-- Action Buttons -->
      <div style="padding: 8px; background: white; border-bottom: 1px solid #e5e5e5; display: flex; gap: 6px;">
        <button @click="openEditor()"
                :style="{
                  flex: 1,
                  padding: '6px 8px',
                  fontSize: '10px',
                  fontWeight: '600',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  background: showEditor ? '#1a1a2e' : '#e5e5e5',
                  color: showEditor ? 'white' : '#374151'
                }">
          Config
        </button>
        <button @click="showDiagram = !showDiagram; if(showDiagram && Object.keys(editValues).length === 0) loadCurrentValues()"
                :style="{
                  flex: 1,
                  padding: '6px 8px',
                  fontSize: '10px',
                  fontWeight: '600',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  background: showDiagram ? '#1a1a2e' : '#e5e5e5',
                  color: showDiagram ? 'white' : '#374151'
                }">
          Diagram
        </button>
      </div>

      <!-- Display Options -->
      <div style="padding: 8px 12px; background: white; border-bottom: 1px solid #e5e5e5;">
        <div style="font-size: 9px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Display</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px 12px;">
          <label style="display: flex; align-items: center; cursor: pointer; font-size: 11px; color: #374151;">
            <input type="checkbox" x-model="showLabels" style="margin-right: 6px; cursor: pointer; accent-color: #1a1a2e;">
            Labels
          </label>
          <label style="display: flex; align-items: center; cursor: pointer; font-size: 11px; color: #374151;">
            <input type="checkbox" x-model="showClassNames" style="margin-right: 6px; cursor: pointer; accent-color: #1a1a2e;">
            Classes
          </label>
          <label style="display: flex; align-items: center; cursor: pointer; font-size: 11px; color: #374151;">
            <input type="checkbox" x-model="showMeasurements" style="margin-right: 6px; cursor: pointer; accent-color: #1a1a2e;">
            Values
          </label>
          <label style="display: flex; align-items: center; cursor: pointer; font-size: 11px; color: #374151;">
            <input type="checkbox" x-model="showLoremIpsum" style="margin-right: 6px; cursor: pointer; accent-color: #1a1a2e;">
            Lorem
          </label>
        </div>
      </div>

      <!-- Padding Options -->
      <div style="padding: 8px 12px; background: white; border-bottom: 1px solid #e5e5e5;">
        <div style="font-size: 9px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Padding</div>
        <div style="display: flex; gap: 12px;">
          <label style="display: flex; align-items: center; cursor: pointer; font-size: 11px; color: #374151;">
            <input type="checkbox" x-model="showGapPadding" style="margin-right: 6px; cursor: pointer; accent-color: #1a1a2e;">
            p-gap
          </label>
          <label style="display: flex; align-items: center; cursor: pointer; font-size: 11px; color: #374151;">
            <input type="checkbox" x-model="showBreakoutPadding" style="margin-right: 6px; cursor: pointer; accent-color: #1a1a2e;">
            p-breakout
          </label>
        </div>
      </div>

      <!-- Advanced -->
      <div style="padding: 8px 12px; background: white;">
        <label style="display: flex; align-items: center; cursor: pointer; font-size: 11px; color: #374151;">
          <input type="checkbox" x-model="showAdvanced" style="margin-right: 6px; cursor: pointer; accent-color: #1a1a2e;">
          Advanced Spans
        </label>
      </div>

      <!-- Footer -->
      <div style="padding: 6px 12px; background: #f7f7f7; border-top: 1px solid #e5e5e5;">
        <div style="font-size: 9px; color: #9ca3af; text-align: center;">
          <kbd style="background: #e5e5e5; padding: 1px 4px; border-radius: 2px; font-size: 9px; font-weight: 600; color: #374151;">⌘G</kbd> toggle
        </div>
      </div>

      <!-- Selected Area Info -->
      <div x-show="selectedArea" style="padding: 8px 12px; background: #f0f9ff; border-top: 1px solid #e5e5e5;">
        <div style="font-size: 11px; color: #1a1a2e; font-weight: 600; font-family: monospace;" x-text="gridAreas.find(a => a.name === selectedArea)?.className || ''"></div>
      </div>
      </div><!-- End Collapsible Content -->

    </div>

    <!-- Floating Editor Window - Ubiquiti-style -->
    <div x-show="showEditor"
         @mousedown.self="startDrag($event)"
         @mousemove.window="onDrag($event)"
         @mouseup.window="stopDrag()"
         :style="{
           position: 'fixed',
           left: editorPos.x + 'px',
           top: editorPos.y + 'px',
           width: '280px',
           maxHeight: '85vh',
           background: '#f7f7f7',
           borderRadius: '8px',
           boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
           pointerEvents: 'auto',
           zIndex: '10001',
           overflow: 'hidden',
           fontFamily: 'system-ui, -apple-system, sans-serif'
         }">
      <!-- Editor Header (draggable) -->
      <div @mousedown="startDrag($event)"
           @dblclick="configEditorCollapsed = !configEditorCollapsed"
           style="padding: 10px 12px; background: #1a1a2e; color: white; cursor: move; display: flex; justify-content: space-between; align-items: center; user-select: none;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-weight: 600; font-size: 12px; letter-spacing: 0.3px;">Grid Config</span>
          <span x-show="configEditorCollapsed" style="font-size: 10px; color: rgba(255,255,255,0.4);">...</span>
        </div>
        <button @click.stop="closeEditor()" style="background: transparent; border: none; color: rgba(255,255,255,0.6); padding: 2px 6px; cursor: pointer; font-size: 16px; line-height: 1;">&times;</button>
      </div>
      <!-- Editor Content -->
      <div x-show="!configEditorCollapsed" style="max-height: calc(85vh - 40px); overflow-y: auto;">
        <!-- Workflow tip -->
        <div style="background: #e8f4f8; padding: 8px 12px; font-size: 10px; color: #1a1a2e; line-height: 1.4; border-bottom: 1px solid #e5e5e5;">
          Start with <strong>content</strong>, then build outward: popout → feature → full
        </div>

        <!-- Track overflow warning -->
        <div x-show="getTrackOverflowWarning()"
             style="background: #fef3c7; padding: 8px 12px; font-size: 10px; color: #92400e; line-height: 1.4; border-bottom: 1px solid #fcd34d;">
          <span style="font-weight: 600;">⚠️</span> <span x-text="getTrackOverflowWarning()"></span>
        </div>

        <!-- Content Section -->
        <div style="padding: 8px 12px; background: white; border-bottom: 1px solid #e5e5e5;">
          <div style="font-size: 9px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Content (Text Width)</div>
          <template x-for="key in ['contentMin', 'contentBase', 'contentMax']" :key="'ed_'+key">
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #f3f4f6;">
              <span style="font-size: 11px; color: #374151;" x-text="key.replace('content', '').toLowerCase()"></span>
              <div style="display: flex; align-items: center; gap: 4px;">
                <input type="number" :value="getNumericValue(key)" @input="updateNumericValue(key, $event.target.value)" step="1"
                       style="width: 72px; padding: 6px 8px; font-size: 11px; font-family: 'SF Mono', Monaco, monospace; border: 1px solid #e5e5e5; border-radius: 4px; background: #f9fafb; text-align: right;">
                <span style="font-size: 10px; color: #9ca3af; width: 24px;" x-text="getUnit(key)"></span>
              </div>
            </div>
          </template>
        </div>

        <!-- Track Widths Section -->
        <div style="padding: 8px 12px; background: white; border-bottom: 1px solid #e5e5e5;">
          <div style="font-size: 9px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Track Widths</div>
          <template x-for="key in ['popoutWidth', 'featureWidth', 'fullLimit']" :key="'ed_'+key">
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #f3f4f6;">
              <span style="font-size: 11px; color: #374151;" x-text="key.replace('Width', '')"></span>
              <div style="display: flex; align-items: center; gap: 4px;">
                <input type="number" :value="getNumericValue(key)" @input="updateNumericValue(key, $event.target.value)" step="1"
                       style="width: 72px; padding: 6px 8px; font-size: 11px; font-family: 'SF Mono', Monaco, monospace; border: 1px solid #e5e5e5; border-radius: 4px; background: #f9fafb; text-align: right;">
                <span style="font-size: 10px; color: #9ca3af; width: 24px;" x-text="getUnit(key)"></span>
              </div>
            </div>
          </template>
        </div>

        <!-- Gap Section -->
        <div style="padding: 8px 12px; background: white; border-bottom: 1px solid #e5e5e5;">
          <div style="font-size: 9px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Gap</div>
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #f3f4f6;">
            <span style="font-size: 11px; color: #374151;">base</span>
            <div style="display: flex; align-items: center; gap: 4px;">
              <input type="number" :value="getNumericValue('baseGap')" @input="updateNumericValue('baseGap', $event.target.value)" step="0.5"
                     style="width: 72px; padding: 6px 8px; font-size: 11px; font-family: 'SF Mono', Monaco, monospace; border: 1px solid #e5e5e5; border-radius: 4px; background: #f9fafb; text-align: right;">
              <span style="font-size: 10px; color: #9ca3af; width: 24px;" x-text="getUnit('baseGap')"></span>
            </div>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #f3f4f6;">
            <span style="font-size: 11px; color: #374151;">max</span>
            <div style="display: flex; align-items: center; gap: 4px;">
              <input type="number" :value="getNumericValue('maxGap')" @input="updateNumericValue('maxGap', $event.target.value)" step="1"
                     style="width: 72px; padding: 6px 8px; font-size: 11px; font-family: 'SF Mono', Monaco, monospace; border: 1px solid #e5e5e5; border-radius: 4px; background: #f9fafb; text-align: right;">
              <span style="font-size: 10px; color: #9ca3af; width: 24px;" x-text="getUnit('maxGap')"></span>
            </div>
          </div>
          <div style="font-size: 9px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin: 8px 0 4px;">Scale <span style="font-size: 8px; color: #ef4444; font-weight: 400; text-transform: none;">(rebuild)</span></div>
          <template x-for="key in Object.keys(gapScaleOptions)" :key="'ed_gs_'+key">
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #f3f4f6;">
              <span style="font-size: 11px; color: #374151;" x-text="key"></span>
              <div style="display: flex; align-items: center; gap: 4px;">
                <input type="number" :value="getGapScaleNumeric(key)" @input="updateGapScaleNumeric(key, $event.target.value)" step="1"
                       style="width: 72px; padding: 6px 8px; font-size: 11px; font-family: 'SF Mono', Monaco, monospace; border: 1px solid #e5e5e5; border-radius: 4px; background: #f9fafb; text-align: right;">
                <span style="font-size: 10px; color: #9ca3af; width: 24px;" x-text="getGapScaleUnit(key)"></span>
              </div>
            </div>
          </template>
        </div>

        <!-- Action Buttons -->
        <div style="padding: 10px 12px; background: #f7f7f7; display: flex; gap: 8px;">
          <button @click="copyConfig()" :style="{ flex: 1, padding: '8px', fontSize: '11px', fontWeight: '600', border: 'none', borderRadius: '4px', cursor: 'pointer', background: copySuccess ? '#10b981' : '#1a1a2e', color: 'white', transition: 'background 0.2s' }">
            <span x-text="copySuccess ? '✓ Copied' : 'Copy Config'"></span>
          </button>
          <button @click="downloadCSS()" style="flex: 1; padding: 8px; font-size: 11px; font-weight: 600; border: 1px solid #e5e5e5; border-radius: 4px; cursor: pointer; background: white; color: #374151;">
            Export CSS
          </button>
        </div>
      </div>
    </div>

    <!-- Grid Diagram -->
    <div x-show="showDiagram"
         style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; border-radius: 0.5rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); pointer-events: auto; z-index: 10001; padding: 1.5rem; max-width: 90vw;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <span style="font-weight: 700; font-size: 0.875rem; color: #111827;">Breakout Grid Structure</span>
        <button @click="showDiagram = false" style="background: #ef4444; border: none; color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; cursor: pointer; font-size: 0.625rem; font-weight: 600;">Close</button>
      </div>
      <!-- Visual Diagram -->
      <div style="font-family: Monaco, monospace; font-size: 0.625rem; line-height: 1.8;">
        <!-- Column structure visualization -->
        <div style="display: flex; align-items: stretch; border: 2px solid #e5e7eb; border-radius: 0.25rem; overflow: hidden; min-height: 120px;">
          <!-- Full left -->
          <div style="background: rgba(239, 68, 68, 0.2); padding: 0.5rem 0.25rem; display: flex; flex-direction: column; justify-content: center; align-items: center; border-right: 1px dashed #e5e7eb; min-width: 40px;">
            <div style="writing-mode: vertical-rl; transform: rotate(180deg); color: #dc2626; font-weight: 600;">full</div>
            <div style="color: #9ca3af; font-size: 0.5rem;">1fr</div>
          </div>
          <!-- Feature left -->
          <div style="background: rgba(234, 179, 8, 0.2); padding: 0.5rem 0.25rem; display: flex; flex-direction: column; justify-content: center; align-items: center; border-right: 1px dashed #e5e7eb; min-width: 50px;">
            <div style="color: #b45309; font-weight: 600;">feature</div>
            <div style="color: #9ca3af; font-size: 0.5rem;" x-text="editValues.featureWidth || configOptions.featureWidth.value"></div>
          </div>
          <!-- Popout left -->
          <div style="background: rgba(34, 197, 94, 0.2); padding: 0.5rem 0.25rem; display: flex; flex-direction: column; justify-content: center; align-items: center; border-right: 1px dashed #e5e7eb; min-width: 40px;">
            <div style="color: #15803d; font-weight: 600;">popout</div>
            <div style="color: #9ca3af; font-size: 0.5rem;" x-text="editValues.popoutWidth || configOptions.popoutWidth.value"></div>
          </div>
          <!-- Content -->
          <div style="background: rgba(168, 85, 247, 0.2); padding: 0.5rem; display: flex; flex-direction: column; justify-content: center; align-items: center; flex: 1; min-width: 80px;">
            <div style="color: #7c3aed; font-weight: 700;">content</div>
            <div style="color: #9ca3af; font-size: 0.5rem;" x-text="'(' + (editValues.contentMin || configOptions.contentMin.value) + ' - ' + (editValues.contentMax || configOptions.contentMax.value) + ')'"></div>
          </div>
          <!-- Popout right -->
          <div style="background: rgba(34, 197, 94, 0.2); padding: 0.5rem 0.25rem; display: flex; flex-direction: column; justify-content: center; align-items: center; border-left: 1px dashed #e5e7eb; min-width: 40px;">
            <div style="color: #15803d; font-weight: 600;">popout</div>
            <div style="color: #9ca3af; font-size: 0.5rem;" x-text="editValues.popoutWidth || configOptions.popoutWidth.value"></div>
          </div>
          <!-- Feature right -->
          <div style="background: rgba(234, 179, 8, 0.2); padding: 0.5rem 0.25rem; display: flex; flex-direction: column; justify-content: center; align-items: center; border-left: 1px dashed #e5e7eb; min-width: 50px;">
            <div style="color: #b45309; font-weight: 600;">feature</div>
            <div style="color: #9ca3af; font-size: 0.5rem;" x-text="editValues.featureWidth || configOptions.featureWidth.value"></div>
          </div>
          <!-- Full right -->
          <div style="background: rgba(239, 68, 68, 0.2); padding: 0.5rem 0.25rem; display: flex; flex-direction: column; justify-content: center; align-items: center; border-left: 1px dashed #e5e7eb; min-width: 40px;">
            <div style="writing-mode: vertical-rl; transform: rotate(180deg); color: #dc2626; font-weight: 600;">full</div>
            <div style="color: #9ca3af; font-size: 0.5rem;">1fr</div>
          </div>
        </div>
        <!-- Legend -->
        <div style="margin-top: 1rem; display: flex; flex-wrap: wrap; gap: 0.75rem; font-size: 0.5625rem;">
          <div><span style="display: inline-block; width: 12px; height: 12px; background: rgba(239, 68, 68, 0.3); border-radius: 2px; vertical-align: middle; margin-right: 0.25rem;"></span>.col-full</div>
          <div><span style="display: inline-block; width: 12px; height: 12px; background: rgba(234, 179, 8, 0.3); border-radius: 2px; vertical-align: middle; margin-right: 0.25rem;"></span>.col-feature</div>
          <div><span style="display: inline-block; width: 12px; height: 12px; background: rgba(34, 197, 94, 0.3); border-radius: 2px; vertical-align: middle; margin-right: 0.25rem;"></span>.col-popout</div>
          <div><span style="display: inline-block; width: 12px; height: 12px; background: rgba(168, 85, 247, 0.3); border-radius: 2px; vertical-align: middle; margin-right: 0.25rem;"></span>.col-content</div>
        </div>
        <!-- Padding explanation -->
        <div style="margin-top: 1rem; padding: 0.75rem; background: #f9fafb; border-radius: 0.25rem; font-size: 0.5625rem; color: #4b5563;">
          <div style="font-weight: 700; margin-bottom: 0.25rem;">px-breakout aligns full-width content:</div>
          <div>Uses <span style="color: #3b82f6;" x-text="editValues.popoutWidth || configOptions.popoutWidth.value"></span> padding so content aligns with .col-content edge</div>
        </div>
      </div>
    </div>

  </div>
`;
