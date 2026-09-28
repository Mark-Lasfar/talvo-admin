// src/components/branches/BranchForm.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Branch, BranchCreate } from '@/types';
import { X, Server } from 'lucide-react';

const branchSchema = z.object({
  branch_name: z.string().min(2, 'اسم الفرع مطلوب'),
  arabic_name: z.string().optional(),
  is_active: z.boolean().default(true),
});

type FormData = z.infer<typeof branchSchema>;

interface BranchFormProps {
  branch?: Branch;
  onSubmit: (data: BranchCreate) => Promise<{ success: boolean }>;
  onClose: () => void;
}

export const BranchForm: React.FC<BranchFormProps> = ({
  branch,
  onSubmit,
  onClose,
}) => {
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      branch_name: branch?.branch_name || '',
      arabic_name: branch?.arabic_name || '',
      is_active: branch?.is_active ?? true,
    },
  });

  useEffect(() => {
    if (branch) {
      reset({
        branch_name: branch.branch_name,
        arabic_name: branch.arabic_name || '',
        is_active: branch.is_active,
      });
    }
  }, [branch, reset]);

  const handleFormSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const result = await onSubmit({
        branch_name: data.branch_name,
        arabic_name: data.arabic_name,
      });
      if (result.success) {
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        {/* ✅ الهيدر */}
        <div className="flex items-center justify-between p-5 border-b">
          <div className="flex items-center gap-2">
            <Server className="text-blue-600" size={20} />
            <h3 className="text-lg font-bold text-gray-800">
              {branch ? '✏️ تعديل فرع' : '➕ إضافة فرع جديد'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* ✅ النموذج */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              اسم الفرع *
            </label>
            <input
              {...register('branch_name')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="مثال: فرع المنصورة"
            />
            {errors.branch_name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.branch_name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الاسم بالعربية (اختياري)
            </label>
            <input
              {...register('arabic_name')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="الاسم بالعربية"
            />
          </div>

          {branch && (
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <input
                {...register('is_active')}
                type="checkbox"
                id="is_active"
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label htmlFor="is_active" className="text-sm text-gray-700">
                الفرع نشط
              </label>
            </div>
          )}

          {branch && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs text-gray-500 mb-1">كود الفرع</p>
              <code className="text-sm font-mono text-blue-600" dir="ltr">
                {branch.branch_code}
              </code>
            </div>
          )}

          {/* ✅ الأزرار */}
          <div className="flex items-center gap-3 pt-2 border-t">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'جاري الحفظ...' : branch ? '💾 تحديث' : '➕ إنشاء'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};