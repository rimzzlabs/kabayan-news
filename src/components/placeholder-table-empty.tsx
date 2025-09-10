import { TableCell, TableRow } from "./ui/table";

type PlaceholderTableEmptyProps = {
  title: string;
  description: string;
  colSpan: number;
};
export function PlaceholderTableEmpty(props: PlaceholderTableEmptyProps) {
  return (
    <TableRow>
      <TableCell colSpan={props.colSpan}>
        <div className="grid h-[calc(100vh-24rem)]">
          <div className="flex flex-col items-center justify-center text-center">
            <p className="font-semibold pb-1">{props.title}</p>
            <p className="text-sm font-medium text-muted-foreground">
              {props.description}
            </p>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}
