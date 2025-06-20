import {
    type ColumnDef,
    type SortingState,
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    Box,
    Button,
    Flex,
    Separator,
    Table,
    Text,
    TextField,
} from "@radix-ui/themes";
import { useState } from "react";
import {
    DownloadIcon,
    PlusIcon,
    SearchIcon,
    TrashIcon,
    UploadIcon,
} from "lucide-react";
import { useFirestore } from "../../hooks/useFirestore.ts";
import type { Player } from "../../utils/types.ts";
import { usePlayerDialog } from "../../hooks/usePlayerDialog.ts";

type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
};

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = useState({});

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            rowSelection,
        },
    });

    const { removePlayers } = useFirestore();
    const { handleOpen, PlayerDialog } = usePlayerDialog();

    const selectedPlayerIds = table
        .getFilteredSelectedRowModel()
        .rows.map((row) => (row.original as Player).id);

    const handleRemovePlayers = async () => {
        await removePlayers(selectedPlayerIds);
        table.resetRowSelection();
    };

    return (
        <>
            <Flex justify="between" align="center" mb="5">
                <Flex align="center" gap="3">
                    <Button onClick={() => handleOpen()}>
                        <PlusIcon size={15} />
                        Add Player
                    </Button>
                    <Button variant="outline">
                        <DownloadIcon size={15} />
                        Export JSON
                    </Button>
                    <Button variant="outline">
                        <UploadIcon size={15} />
                        Import JSON
                    </Button>
                    {selectedPlayerIds.length > 0 && (
                        <>
                            <Separator size="2" orientation="vertical" />
                            <Text>{selectedPlayerIds.length} selected</Text>
                            <Button color="red" onClick={handleRemovePlayers}>
                                <TrashIcon size={15} />
                                Delete Selected
                            </Button>
                        </>
                    )}
                </Flex>
                <Box width="250px" maxWidth="250px">
                    <TextField.Root
                        id="search"
                        name="search"
                        placeholder="Search players by name..."
                        value={
                            (table
                                .getColumn("name")
                                ?.getFilterValue() as string) ?? ""
                        }
                        onChange={(event) =>
                            table
                                .getColumn("name")
                                ?.setFilterValue(event.target.value)
                        }
                    >
                        <TextField.Slot>
                            <SearchIcon size={15} />
                        </TextField.Slot>
                    </TextField.Root>
                </Box>
            </Flex>
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
                                colSpan={columns.length}
                                className="h-24 text-center"
                            >
                                No results.
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table.Root>
            <PlayerDialog />
        </>
    );
}
