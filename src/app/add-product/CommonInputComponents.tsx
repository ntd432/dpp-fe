import { MeasurementValue } from "./InputInterfaces";

const INPUT_CLASS =
  "px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue-light)] focus:border-[var(--color-brand-blue-light)]";

type Translator = (key: string) => string;

export function MeasurementInput({
  fieldKey,
  label,
  measurement,
  unitOptions,
  onChange,
  t,
}: Readonly<{
  fieldKey?: string;
  label: string;
  measurement: MeasurementValue;
  unitOptions: string[];
  onChange: (next: MeasurementValue) => void;
  t: Translator;
}>) {
  const isCustom = measurement.unit === "custom";
  return (
    <div className="space-y-2">
      <span className="block text-sm font-medium text-gray-700">{label}</span>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          step="any"
          placeholder={t(`${label} value`)}
          value={measurement.value}
          onChange={(e) => onChange({ ...measurement, value: e.target.value })}
          className={INPUT_CLASS}
          data-field-key={`${fieldKey}.value`}
        />
        <select
          value={measurement.unit}
          onChange={(e) => onChange({ ...measurement, unit: e.target.value })}
          className={INPUT_CLASS}
          data-field-key={`${fieldKey}.unit`}
        >
          <option value="">{t("Select unit")}</option>
          {unitOptions.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
          <option value="custom">{t("Custom")}</option>
        </select>
      </div>
      {isCustom && (
        <input
          type="text"
          placeholder={t("Enter custom unit")}
          value={measurement.customUnit}
          onChange={(e) =>
            onChange({ ...measurement, customUnit: e.target.value })
          }
          className={INPUT_CLASS}
          data-field-key={`${fieldKey}.customUnit`}
        />
      )}
    </div>
  );
}