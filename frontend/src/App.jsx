import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Leaf,
  Loader2,
  RotateCcw,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Upload,
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000';
const DEFAULT_CLASSES = ['Bacterial blight', 'Blast', 'Brown Spot', 'Tungro'];

const stats = [
  { label: 'MobileNetV2', value: 'Efficient inference' },
  { label: 'Kaggle Dataset', value: 'Rice leaf imagery' },
  { label: 'FastAPI + React', value: 'Modern deployment stack' },
];

const pipeline = [
  'Kaggle Dataset',
  'MobileNetV2 Training',
  'FastAPI Inference',
  'React Dashboard',
];

function confidencePercent(value) {
  return `${Math.round((value || 0) * 100)}%`;
}

function App() {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const probabilityRows = useMemo(() => {
    const rows = prediction?.probabilities?.length ? prediction.probabilities : DEFAULT_CLASSES.map((name) => ({ class_name: name, probability: 0 }));
    return rows;
  }, [prediction]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      setPrediction(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setImageFile(file);
    setPreviewUrl(objectUrl);
    setPrediction(null);
    setError('');
  };

  const handlePredict = async () => {
    if (!imageFile) {
      setError('Please choose a rice leaf image first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', imageFile);

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        body: formData,
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.detail || 'Prediction request failed.');
      }

      setPrediction(payload);
    } catch (requestError) {
      setPrediction(null);
      setError(requestError.message || 'Unable to complete the prediction.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setImageFile(null);
    setPreviewUrl('');
    setPrediction(null);
    setError('');
    setIsLoading(false);
  };

  const topProbability = prediction?.confidence ?? 0;

  return (
    <div className="min-h-screen text-slate-900">
      <header className="sticky top-0 z-20 border-b border-white/70 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-soft">
              <Leaf size={22} />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">CropSense ML</p>
              <p className="text-sm text-slate-500">Rice Leaf Disease Classifier</p>
            </div>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800">
              <BadgeCheck size={16} /> Kaggle Trained Model
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <section className="rounded-[2rem] border border-white/70 bg-hero-gradient px-6 py-10 shadow-soft sm:px-10 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-medium text-emerald-800 shadow-sm backdrop-blur">
                <Sparkles size={16} /> AI-powered agricultural intelligence
              </div>
              <div className="space-y-4">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                  AI-Powered Rice Leaf Disease Detection
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-600">
                  Upload a rice leaf image to classify disease and get treatment guidance in a premium ML dashboard.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {stats.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/80 bg-white/80 p-4 shadow-sm backdrop-blur">
                    <p className="text-sm font-semibold text-slate-500">{item.label}</p>
                    <p className="mt-1 text-base font-semibold text-slate-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/80 bg-white/80 p-6 shadow-soft backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Pipeline</p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">From dataset to treatment insight</h2>
                </div>
                <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                  <ScanSearch size={22} />
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {pipeline.map((step, index) => (
                  <div key={step} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
                      {index + 1}
                    </div>
                    <p className="font-medium text-slate-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-white/80 bg-white/80 p-6 shadow-soft backdrop-blur-xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Input</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-950">Upload rice leaf image</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">PNG, JPG, or WEBP image files work best.</p>
              </div>
              <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                <Upload size={22} />
              </div>
            </div>

            <label className="mt-6 flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-[1.75rem] border-2 border-dashed border-emerald-200 bg-emerald-50/70 p-6 text-center transition hover:border-emerald-400 hover:bg-emerald-50">
              <input className="hidden" type="file" accept="image/*" onChange={handleFileChange} />
              {previewUrl ? (
                <img src={previewUrl} alt="Uploaded rice leaf preview" className="max-h-64 rounded-2xl object-contain shadow-soft" />
              ) : (
                <div className="space-y-3 text-slate-600">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm">
                    <Upload size={26} />
                  </div>
                  <p className="text-lg font-semibold text-slate-900">Drop or click to upload</p>
                  <p className="text-sm">Choose a rice leaf image to run disease classification.</p>
                </div>
              )}
            </label>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handlePredict}
                disabled={isLoading}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-4 text-sm font-semibold text-white shadow-soft transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <ArrowRight size={18} />}
                {isLoading ? 'Predicting...' : 'Predict Disease'}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <RotateCcw size={18} />
                Reset
              </button>
            </div>

            {error ? (
              <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                {error}
              </div>
            ) : null}
          </div>

          <div className="rounded-[2rem] border border-white/80 bg-white/80 p-6 shadow-soft backdrop-blur-xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Result</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-950">Prediction overview</h3>
              </div>
              <div className="rounded-2xl bg-slate-100 p-3 text-slate-600">
                <BarChart3 size={22} />
              </div>
            </div>

            <div className="mt-6 rounded-[1.75rem] border border-slate-100 bg-slate-50 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Predicted disease</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-950">
                    {prediction?.prediction || 'Awaiting prediction'}
                  </p>
                </div>
                <div className="rounded-2xl bg-emerald-600 px-4 py-3 text-white">
                  <p className="text-xs uppercase tracking-[0.18em] text-emerald-100">Confidence</p>
                  <p className="mt-1 text-2xl font-semibold">{confidencePercent(topProbability)}</p>
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
                  <span>Confidence meter</span>
                  <span>{confidencePercent(topProbability)}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-700 transition-all"
                    style={{ width: confidencePercent(topProbability) }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-[1.75rem] border border-emerald-100 bg-emerald-50 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white p-2 text-emerald-700 shadow-sm">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Treatment suggestion</p>
                </div>
              </div>
              <p className="mt-4 leading-7 text-slate-700">
                {prediction?.treatment_suggestion || 'Run a prediction to see a disease-specific treatment recommendation.'}
              </p>
            </div>

            <div className="mt-6">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                <BarChart3 size={16} /> Probability breakdown
              </div>
              <div className="space-y-4">
                {probabilityRows.map((item) => {
                  const percentage = Math.round((item.probability || 0) * 100);
                  return (
                    <div key={item.raw_class_name || item.class_name} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">{item.class_name}</span>
                        <span className="text-slate-500">{percentage}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[2rem] border border-white/80 bg-white/80 p-6 shadow-soft backdrop-blur-xl sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Supported classes</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {DEFAULT_CLASSES.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-4 text-slate-700">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <BadgeCheck size={16} />
                  </div>
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/80 bg-slate-950 p-6 text-white shadow-soft sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">Project pipeline</p>
            <h4 className="mt-3 text-2xl font-semibold">Kaggle Dataset to React dashboard</h4>
            <p className="mt-3 leading-7 text-slate-300">
              Kaggle Dataset → MobileNetV2 Training → FastAPI Inference → React Dashboard
            </p>
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-300">
                This dashboard is designed to present a polished end-to-end machine learning workflow for portfolio use.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;