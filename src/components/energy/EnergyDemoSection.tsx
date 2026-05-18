"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { EnergyChart, type ChartPoint } from "./EnergyChart";
import { DemoDashboardHeader } from "./DemoDashboardHeader";
import { EnergyProportionViz } from "./EnergyProportionViz";
import { PeakDemandChartViz } from "./PeakDemandChartViz";
import { demoDashboardTheme as dash } from "@/lib/energy/dashboardTheme";
import {
  mockPlants,
  DEMO_BASE_POWER_KW,
  generateReading,
  formatDemoEnergyKwh,
  formatDemoPowerKw,
  formatDemoVoltageKv,
  formatRinggit,
  formatRinggitPerMonth,
  isPeakHour,
  isWeekday,
  type MeterReading,
  type PlantMock,
} from "@/lib/energy/mockData";
import { section, text } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";

type Tab = "overview" | "peak" | "energy";

const DEMO_TAB_ORDER: Tab[] = ["overview", "peak", "energy"];
const DEMO_TAB_ROTATE_MS = 3000;

export function EnergyDemoSection() {
  const t = useTranslations("energy");
  const [loading, setLoading] = useState(true);
  const [plantId, setPlantId] = useState(mockPlants[0].id);
  const [tab, setTab] = useState<Tab>("overview");
  const [tabAutoRotate, setTabAutoRotate] = useState(true);
  const plant = mockPlants.find((p) => p.id === plantId) ?? mockPlants[0];
  const now = new Date();
  const peak = isPeakHour(now);
  const weekday = isWeekday(now);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading || !tabAutoRotate) return;
    const id = setInterval(() => {
      setTab((current) => {
        const i = DEMO_TAB_ORDER.indexOf(current);
        return DEMO_TAB_ORDER[(i + 1) % DEMO_TAB_ORDER.length];
      });
    }, DEMO_TAB_ROTATE_MS);
    return () => clearInterval(id);
  }, [loading, tabAutoRotate]);

  const selectTab = useCallback((next: Tab) => {
    setTabAutoRotate(false);
    setTab(next);
  }, []);

  if (loading) {
    return (
      <section className={cn("py-20 md:py-28", section.default)}>
        <div className="mx-auto max-w-7xl px-4 flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto" />
            <p className="mt-4 text-slate-500 text-sm">{t("loading")}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={cn("py-20 md:py-28", section.default)}>
      <div className="mx-auto max-w-7xl px-4">
        <p className={cn("text-sm md:text-base max-w-3xl", text.body)}>{t("demoIntro")}</p>
        <div className="mt-6">
          <DemoMeterSimulator key={plant.id} plant={plant}>
            {({ reading, powerHistory }) => {
              const powerSeries: ChartPoint[] = powerHistory.map((r, i) => ({
                x: i,
                y: r.power,
              }));
              return (
                <DemoPanel
                  t={t}
                  plantId={plantId}
                  setPlantId={setPlantId}
                  tab={tab}
                  onTabSelect={selectTab}
                  plant={plant}
                  reading={reading}
                  peak={peak}
                  weekday={weekday}
                  powerSeries={powerSeries}
                />
              );
            }}
          </DemoMeterSimulator>
        </div>
      </div>
    </section>
  );
}

function DemoMeterSimulator({
  plant,
  children,
}: {
  plant: PlantMock;
  children: (data: { reading: MeterReading; powerHistory: MeterReading[] }) => ReactNode;
}) {
  const mult = plant.currentPower / DEMO_BASE_POWER_KW;

  const [reading, setReading] = useState(() => generateReading(mult));
  const [powerHistory, setPowerHistory] = useState<MeterReading[]>(() =>
    Array.from({ length: 24 }, () => generateReading(mult))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const m = plant.currentPower / DEMO_BASE_POWER_KW;
      setReading(generateReading(m));
      setPowerHistory((h) => [...h.slice(-23), generateReading(m)]);
    }, 3000);
    return () => clearInterval(interval);
  }, [plant.currentPower]);

  return <>{children({ reading, powerHistory })}</>;
}

function DemoPanel({
  t,
  plantId,
  setPlantId,
  tab,
  onTabSelect,
  plant,
  reading,
  peak,
  weekday,
  powerSeries,
}: {
  t: ReturnType<typeof useTranslations<"energy">>;
  plantId: string;
  setPlantId: (id: string) => void;
  tab: Tab;
  onTabSelect: (t: Tab) => void;
  plant: PlantMock;
  reading: MeterReading;
  peak: boolean;
  weekday: boolean;
  powerSeries: ChartPoint[];
}) {
  const peakStatusText = !weekday
    ? t("peakStatusWeekend")
    : peak
      ? t("peakStatusPeak")
      : t("peakStatusOffPeak");
  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: t("tabOverview") },
    { id: "peak", label: t("tabPeak") },
    { id: "energy", label: t("tabEnergy") },
  ];

  return (
    <section className={cn("overflow-hidden rounded-2xl shadow-xl ring-1 ring-teal-500/10", dash.shell)}>
      <DemoDashboardHeader
        portalName={t("demoPortalName")}
        subtitle={t("demoTitle")}
        liveLabel={t("demoLive")}
        facilityLabel={t("demoFacility")}
        plantId={plantId}
        plantOptions={mockPlants.map((p) => ({ id: p.id, name: p.name }))}
        onPlantChange={setPlantId}
      />

      <div className={cn("p-4 sm:p-6 lg:p-8", dash.body)}>
        <div className={cn("mb-6 flex gap-2 rounded-lg p-1", dash.tabBar)}>
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => onTabSelect(id)}
            className={cn(
              "flex-1 rounded-md py-2 px-3 text-sm font-medium transition-colors",
              tab === id ? dash.tabActive : dash.tabIdle
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <Kpi label="Voltage" value={formatDemoVoltageKv(reading.voltage)} />
        <Kpi label="Current" value={`${reading.ampere} A`} />
        <Kpi label="Power" value={formatDemoPowerKw(reading.power)} />
        <Kpi label="Reactive" value={`${reading.reactivePower} kVAR`} />
        <Kpi label="Energy" value={formatDemoEnergyKwh(reading.energy)} />
      </div>

      {tab === "overview" && (
        <div className="space-y-6">
          <div className={cn("rounded-lg p-4", dash.card)}>
            <h3 className="mb-3 text-sm text-slate-400">Power Consumption 15m Average</h3>
            <EnergyChart data={powerSeries} unit="kW" variant="portal" />
          </div>
          <OptimizationCards plant={plant} />
        </div>
      )}

      {tab === "peak" && (
        <div className="space-y-4">
          <div
            className={cn(
              "rounded-lg p-3 ring-1 ring-inset",
              peak ? "bg-danger-soft ring-danger/25" : "bg-success-soft ring-success/25"
            )}
          >
            <p className="text-sm font-medium text-slate-200">Current Period Status</p>
            <p className="mt-1 text-sm text-slate-300">{peakStatusText}</p>
          </div>
          <PeakDemandChartViz
            plant={plant}
            title={t("peakChartTitle")}
            legendMd={t("peakChartLegendMd")}
            legendPower={t("peakChartLegendPower")}
            statMinLabel={t("peakChartStatMin")}
            statMaxLabel={t("peakChartStatMax")}
            statMeanLabel={t("peakChartStatMean")}
            peakPeriodLabel={t("peakChartPeriod")}
            refMaxLabel={(value) => t("peakChartRefMax", { value })}
            refMinLabel={(value) => t("peakChartRefMin", { value })}
            refTargetLabel={(value) => t("peakChartRefTarget", { value })}
            timeStartLabel={t("peakChartTimeStart")}
            timeEndLabel={t("peakChartTimeEnd")}
            yAxisUnit={t("peakChartYAxis")}
          />
        </div>
      )}

      {tab === "energy" && (
        <EnergyProportionViz
          plant={plant}
          title={t("energyMixTitle")}
          touTitle={t("energyMixTouTitle")}
          costTitle={t("energyMixCostTitle")}
          categoryTitle={t("energyMixCategoryTitle")}
          loadFactorTitle={t("energyMixLoadFactorTitle")}
          mdTitle={t("energyMixMdTitle")}
          peakLabel={t("energyMixPeakLabel")}
          offPeakLabel={t("energyMixOffPeakLabel")}
          energyLabel={t("energyMixEnergyLabel")}
          demandLabel={t("energyMixDemandLabel")}
          peakShareSub={t("energyMixPeakShareSub")}
          energyShareSub={t("energyMixEnergyShareSub")}
          categoryByLoadSub={t("energyMixCategorySub")}
          categoryProdLabel={t("energyMixCategoryProd")}
          categoryHvacLabel={t("energyMixCategoryHvac")}
          categoryLightLabel={t("energyMixCategoryLight")}
          categoryOtherLabel={t("energyMixCategoryOther")}
          loadFactorCaption={t("energyMixLoadFactorCaption")}
          footerNote={t("energyMixFooter")}
        />
      )}
      </div>
    </section>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className={cn("rounded-lg p-3 text-center", dash.card)}>
      <div className="text-xs text-slate-400">{label}</div>
      <div className="text-lg font-semibold mt-1">{value}</div>
    </div>
  );
}

function OptimizationCards({ plant }: { plant: PlantMock }) {
  const peakCost = Math.round(plant.currentPower * 170);
  const offPeakCost = Math.round(plant.offPeakPower * 120);
  const totalBefore = peakCost + offPeakCost + 12000;
  const totalAfter = Math.round(totalBefore * 0.85);

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <OptCard
        title="Before Optimization"
        peak={`${plant.currentPower} kW`}
        offPeak={`${plant.offPeakPower} kW`}
        total={formatRinggitPerMonth(totalBefore)}
        variant="before"
      />
      <OptCard
        title="After Optimization"
        peak={`${Math.round(plant.currentPower * 0.85)} kW`}
        offPeak={`${Math.round(plant.offPeakPower * 0.85)} kW`}
        total={formatRinggitPerMonth(totalAfter)}
        variant="after"
      />
      <div className="md:col-span-2 grid grid-cols-3 gap-4 text-center">
        <div className="bg-success-soft rounded-lg p-4 ring-1 ring-inset ring-success/25">
          <div className="text-2xl font-bold text-success">15%</div>
          <div className="text-xs text-slate-400 mt-1">Cost Reduction</div>
        </div>
        <MonthlySavingsCard amount={totalBefore - totalAfter} />
        <div className={cn("rounded-lg p-4", dash.cardMuted)}>
          <div className="text-2xl font-bold">{formatRinggit((totalBefore - totalAfter) * 12)}</div>
          <div className="text-xs text-slate-400 mt-1">Annual Savings</div>
        </div>
      </div>
    </div>
  );
}

function MonthlySavingsCard({ amount }: { amount: number }) {
  return (
    <div className={cn("rounded-lg p-4", dash.cardMuted)}>
      <div className="text-2xl font-bold">{formatRinggit(amount)}</div>
      <div className="text-xs text-slate-400 mt-1">Monthly Savings</div>
    </div>
  );
}

function OptCard({
  title,
  peak,
  offPeak,
  total,
  variant,
}: {
  title: string;
  peak: string;
  offPeak: string;
  total: string;
  variant: "before" | "after";
}) {
  return (
    <div
      className={`rounded-lg p-4 ring-1 ring-inset ${
        variant === "before" ? cn(dash.cardMuted, "ring-white/10") : "bg-success-soft ring-success/30"
      }`}
    >
      <h4 className="font-medium mb-3">{title}</h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-400">Peak Period</span>
          <span>{peak}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Off-Peak</span>
          <span>{offPeak}</span>
        </div>
        <div className="flex justify-between font-medium pt-2 border-t border-white/10">
          <span className="text-slate-400">Total Energy Cost</span>
          <span>{total}</span>
        </div>
      </div>
    </div>
  );
}
