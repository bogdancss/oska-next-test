"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  bloodPressureReadingInputSchema,
  type BloodPressureReadingInput,
} from "@/utils/blood-pressure-validation";

interface Props {
  userId: number;
  onSuccess?: () => void;
}

export function BloodPressureReadingForm({ userId, onSuccess }: Props) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<BloodPressureReadingInput>({
    resolver: zodResolver(bloodPressureReadingInputSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: BloodPressureReadingInput) => {
    setServerError(null);

    try {
      const response = await fetch(
        `/api/users/${userId}/blood-pressure-readings`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );

      const body = (await response.json()) as {
        errors?: Record<string, string[]>;
        warning?: string;
      };

      if (!response.ok) {
        const fieldErrors = body.errors;
        if (fieldErrors) {
          for (const [field, messages] of Object.entries(fieldErrors)) {
            if (field === "systolic" || field === "diastolic") {
              setError(field, { message: messages.join(", ") });
            }
          }
        } else {
          setServerError("Something went wrong. Please try again.");
        }
        return;
      }

      if (body.warning) {
        window.alert(body.warning);
      }

      reset();
      onSuccess?.();
    } catch {
      setServerError("Could not reach the server. Please try again.");
    }
  };

  return (
    <div className="w-64 rounded-md border border-gray-200 px-4 py-2">
      <h2 className="text-lg font-medium">Submit Reading</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-2 flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="systolic" className="text-sm font-medium">
            Systolic (mmHg)
          </label>
          <input
            id="systolic"
            type="number"
            {...register("systolic", { valueAsNumber: true })}
            className="rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="e.g. 120"
          />
          {errors.systolic && (
            <p className="text-xs text-red-600">{errors.systolic.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="diastolic" className="text-sm font-medium">
            Diastolic (mmHg)
          </label>
          <input
            id="diastolic"
            type="number"
            {...register("diastolic", { valueAsNumber: true })}
            className="rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="e.g. 80"
          />
          {errors.diastolic && (
            <p className="text-xs text-red-600">{errors.diastolic.message}</p>
          )}
        </div>

        {serverError && (
          <p className="text-xs text-red-600">{serverError}</p>
        )}

        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
