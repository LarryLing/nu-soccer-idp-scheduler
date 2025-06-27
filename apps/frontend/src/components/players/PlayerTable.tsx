import { flexRender } from "@tanstack/react-table";
import { Table } from "@radix-ui/themes";
import type { Table as TanstackTable } from "@tanstack/react-table";
import type { Player } from "../../utils/types.ts";
import { useEditPlayerDialog } from "../../hooks/useEditPlayerDialog.ts";
import EditPlayerDialog from "./EditPlayerDialog.tsx";

type PlayerTableProps = {
    table: TanstackTable<Player>;
    numColumns: number;
    players: Player[];
};

export function PlayerTable({ table, numColumns, players }: PlayerTableProps) {
    const useEditPlayerDialogContext = useEditPlayerDialog();

    return (
        <>
            <Table.Root variant="surface">
                <Table.Header>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Table.Row key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <Table.ColumnHeaderCell key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext(),
                                              )}
                                    </Table.ColumnHeaderCell>
                                );
                            })}
                        </Table.Row>
                    ))}
                </Table.Header>
                <Table.Body>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <Table.Row
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <Table.Cell key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </Table.Cell>
                                ))}
                            </Table.Row>
                        ))
                    ) : (
                        <Table.Row>
                            <Table.Cell
                                colSpan={numColumns}
                                className="h-24 text-center"
                            >
                                No results.
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table.Root>
            <EditPlayerDialog
                {...useEditPlayerDialogContext}
                players={players}
            />
        </>
    );
}
