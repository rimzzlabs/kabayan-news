import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAspirationCategories } from "@/modules/aspiration/hooks";
import type { CreateAspirationSchema } from "@/modules/aspiration/zod-schema";
import { F, O, pipe } from "@mobily/ts-belt";
import { useFormContext } from "react-hook-form";

export function CreateAspirationFormCategory() {
  let form = useFormContext<CreateAspirationSchema>();
  let categoriesQuery = useAspirationCategories({ limit: 100 });

  let categories = pipe(
    categoriesQuery.data,
    O.fromNullable,
    O.mapWithDefault([], F.identity),
    F.toMutable,
  );

  return (
    <FormField
      control={form.control}
      name="category"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Kategori Aspirasi</FormLabel>
          <Select
            value={field.value}
            onValueChange={field.onChange}
            disabled={categoriesQuery.isPending}
          >
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih kategori aspirasi" />
              </SelectTrigger>
            </FormControl>

            <SelectContent>
              <SelectGroup>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.nama}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
}
