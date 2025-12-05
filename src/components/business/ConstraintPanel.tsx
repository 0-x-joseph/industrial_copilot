'use client';

import React, { useState } from 'react';
import { Icon } from '@/components/ui';

/**
 * Constraint Rule Type Definitions
 */
export interface ConstraintRule {
  id: string;
  target: string;
  operator: string;
  value: string | number;
  description?: string;
}

export interface ConstraintPanelProps {
  onConstraintsChange?: (constraints: Record<string, any>) => void;
  onSimulate?: () => void;
  isSimulating?: boolean;
}

/**
 * Available constraint targets with their configurations
 */
const CONSTRAINT_TARGETS = [
  { value: 'gta1_status', label: 'GTA 1 Status', type: 'select', options: ['ON', 'OFF', 'MAINTENANCE'] },
  { value: 'gta2_status', label: 'GTA 2 Status', type: 'select', options: ['ON', 'OFF', 'MAINTENANCE'] },
  { value: 'gta3_status', label: 'GTA 3 Status', type: 'select', options: ['ON', 'OFF', 'MAINTENANCE'] },
  { value: 'cap_steam', label: 'Client CAP Steam (T/hr)', type: 'number', min: 0, max: 600 },
  { value: 'max_grid_import', label: 'Max Grid Import (MW)', type: 'number', min: 0, max: 50 },
  { value: 'min_total_steam', label: 'Min Total Steam (T/hr)', type: 'number', min: 0, max: 600 },
];

/**
 * ConstraintPanel Component
 * 
 * Business-oriented rule engine for defining optimization constraints.
 * Users can add/remove rules dynamically to model real-world scenarios.
 * 
 * Examples:
 * - "GTA 2 = MAINTENANCE" (50% capacity)
 * - "Client CAP >= 420" (minimum steam requirement)
 * - "Max Grid Import = 30" (limit grid usage)
 */
export const ConstraintPanel: React.FC<ConstraintPanelProps> = ({
  onConstraintsChange,
  onSimulate,
  isSimulating = false
}) => {
  const [rules, setRules] = useState<ConstraintRule[]>([]);
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [newRule, setNewRule] = useState<Partial<ConstraintRule>>({
    target: '',
    operator: '=',
    value: ''
  });

  /**
   * Add a new constraint rule
   */
  const handleAddRule = () => {
    if (!newRule.target || !newRule.value) {
      alert('Please fill in all fields');
      return;
    }

    const rule: ConstraintRule = {
      id: `rule-${Date.now()}`,
      target: newRule.target,
      operator: newRule.operator || '=',
      value: newRule.value,
      description: generateRuleDescription(newRule)
    };

    const updatedRules = [...rules, rule];
    setRules(updatedRules);
    
    // Notify parent component
    if (onConstraintsChange) {
      onConstraintsChange(convertRulesToConstraints(updatedRules));
    }

    // Reset form
    setNewRule({ target: '', operator: '=', value: '' });
    setIsAddingRule(false);
  };

  /**
   * Remove a constraint rule
   */
  const handleRemoveRule = (ruleId: string) => {
    const updatedRules = rules.filter(r => r.id !== ruleId);
    setRules(updatedRules);
    
    if (onConstraintsChange) {
      onConstraintsChange(convertRulesToConstraints(updatedRules));
    }
  };

  /**
   * Generate human-readable description for a rule
   */
  const generateRuleDescription = (rule: Partial<ConstraintRule>): string => {
    const target = CONSTRAINT_TARGETS.find(t => t.value === rule.target);
    if (!target) return '';

    if (target.type === 'select') {
      return `${target.label}: ${rule.value}`;
    } else {
      return `${target.label} ${rule.operator} ${rule.value}`;
    }
  };

  /**
   * Convert UI rules to API constraints format
   */
  const convertRulesToConstraints = (rules: ConstraintRule[]): Record<string, any> => {
    const constraints: Record<string, any> = {};
    
    rules.forEach(rule => {
      // For status rules, just pass the value
      if (rule.target.endsWith('_status')) {
        constraints[rule.target] = rule.value;
      } 
      // For numeric rules, convert to number
      else {
        constraints[rule.target] = typeof rule.value === 'string' 
          ? parseFloat(rule.value) 
          : rule.value;
      }
    });

    return constraints;
  };

  /**
   * Get the appropriate input for the selected target
   */
  const renderValueInput = () => {
    if (!newRule.target) return null;

    const target = CONSTRAINT_TARGETS.find(t => t.value === newRule.target);
    if (!target) return null;

    if (target.type === 'select') {
      return (
        <select
          value={newRule.value as string}
          onChange={(e) => setNewRule({ ...newRule, value: e.target.value })}
          className="px-3 py-2 bg-[#1E2028] border border-[#435663] rounded-lg text-[#FFF8D4] focus:outline-none focus:border-[#A3B087]"
        >
          <option value="">Select...</option>
          {target.options?.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
    } else {
      return (
        <input
          type="number"
          value={newRule.value}
          onChange={(e) => setNewRule({ ...newRule, value: e.target.value })}
          min={target.min}
          max={target.max}
          placeholder="Value"
          className="px-3 py-2 bg-[#1E2028] border border-[#435663] rounded-lg text-[#FFF8D4] focus:outline-none focus:border-[#A3B087] w-32"
        />
      );
    }
  };

  return (
    <div className="bg-[#313647] rounded-lg p-4 border border-[#435663]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon name="commands" size={20} color="primary" />
          <h3 className="text-lg font-semibold text-[#FFF8D4]">Business Constraints</h3>
        </div>
        <button
          onClick={() => setIsAddingRule(!isAddingRule)}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#A3B087] hover:bg-[#8A9670] text-white rounded-lg transition-colors text-sm font-medium"
        >
          <Icon name="add" size={16} color="inverse" />
          Add Rule
        </button>
      </div>

      {/* Active Rules List */}
      <div className="space-y-2 mb-4">
        {rules.length === 0 ? (
          <div className="text-center py-6 text-[#8E9098] text-sm">
            <Icon name="files" size={32} color="secondary" className="mx-auto mb-2 opacity-50" />
            No constraints defined. Click "Add Rule" to add business constraints.
          </div>
        ) : (
          rules.map(rule => (
            <div
              key={rule.id}
              className="flex items-center justify-between p-3 bg-[#1E2028] rounded-lg border border-[#435663] hover:border-[#A3B087] transition-colors"
            >
              <div className="flex items-center gap-3">
                <Icon name="agent-selector" size={16} color="primary" />
                <span className="text-[#FFF8D4] text-sm font-medium">
                  {rule.description}
                </span>
              </div>
              <button
                onClick={() => handleRemoveRule(rule.id)}
                className="p-1 hover:bg-[#435663] rounded transition-colors"
                aria-label="Remove rule"
              >
                <Icon name="minus" size={16} color="secondary" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Rule Form */}
      {isAddingRule && (
        <div className="p-4 bg-[#1E2028] rounded-lg border border-[#435663] space-y-3">
          <div className="text-sm font-medium text-[#FFF8D4] mb-2">
            Define New Constraint Rule
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Target Selection */}
            <select
              value={newRule.target}
              onChange={(e) => setNewRule({ ...newRule, target: e.target.value, value: '' })}
              className="px-3 py-2 bg-[#313647] border border-[#435663] rounded-lg text-[#FFF8D4] focus:outline-none focus:border-[#A3B087] flex-1 min-w-[200px]"
            >
              <option value="">Select Target...</option>
              {CONSTRAINT_TARGETS.map(target => (
                <option key={target.value} value={target.value}>
                  {target.label}
                </option>
              ))}
            </select>

            {/* Operator (only for numeric targets) */}
            {newRule.target && CONSTRAINT_TARGETS.find(t => t.value === newRule.target)?.type === 'number' && (
              <select
                value={newRule.operator}
                onChange={(e) => setNewRule({ ...newRule, operator: e.target.value })}
                className="px-3 py-2 bg-[#313647] border border-[#435663] rounded-lg text-[#FFF8D4] focus:outline-none focus:border-[#A3B087]"
              >
                <option value="=">=</option>
                <option value=">=">&gt;=</option>
                <option value="<=">&lt;=</option>
              </select>
            )}

            {/* Value Input */}
            {renderValueInput()}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleAddRule}
              className="px-4 py-2 bg-[#A3B087] hover:bg-[#8A9670] text-white rounded-lg transition-colors text-sm font-medium"
            >
              Add Rule
            </button>
            <button
              onClick={() => {
                setIsAddingRule(false);
                setNewRule({ target: '', operator: '=', value: '' });
              }}
              className="px-4 py-2 bg-[#435663] hover:bg-[#5A6A7A] text-[#FFF8D4] rounded-lg transition-colors text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Simulate Button */}
      <div className="mt-4 pt-4 border-t border-[#435663]">
        <button
          onClick={onSimulate}
          disabled={isSimulating}
          className="w-full px-4 py-3 bg-[#A3B087] hover:bg-[#8A9670] disabled:bg-[#435663] disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
        >
          {isSimulating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Optimizing...
            </>
          ) : (
            <>
              <Icon name="send" size={20} color="inverse" />
              Run Optimization
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ConstraintPanel;
