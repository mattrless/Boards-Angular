import { AuthSessionService } from './../../../../services/auth-session.service';
import { BoardPermissionsService } from './../../../../services/board-permissions.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { CardMembersService } from './../../../../api/generated/card-members/card-members.service';
import { Component, computed, inject, input, signal } from '@angular/core';
import { UserResponseDto } from '../../../../api/generated/model';
import { finalize, of } from 'rxjs';
import { BoardDetailStateService } from '../../../../services/board-detail-state.service';
import { CardMembersParams } from '../../types/CardMemberParams';
import {
	type ColumnDef,
	createAngularTable,
	flexRenderComponent,
	FlexRenderDirective,
	getCoreRowModel,
} from '@tanstack/angular-table';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { RemoveCardMemberButton } from '../remove-card-member-button/remove-card-member-button';
import { toast } from '@spartan-ng/brain/sonner';

@Component({
  selector: 'card-members-data-table',
  imports: [HlmTableImports, FlexRenderDirective, HlmButtonImports],
  templateUrl: './card-members-data-table.html',
})
export class CardMembersDataTable {
  private readonly cardMembersService = inject(CardMembersService);
  private readonly boardDetailStateService = inject(BoardDetailStateService);
  private readonly boardPermissionsService = inject(BoardPermissionsService);
  private readonly authSessionService = inject(AuthSessionService);

  readonly boardId = this.boardDetailStateService.boardId;
  readonly cardId = input.required<number>();
  readonly userId = computed(() => {
    return this.authSessionService.user()?.id;
  })

  readonly pageSize = signal(5);
  readonly currentPage = signal(0);

  readonly isDeleting = signal<boolean>(false);

  readonly canRemoveMember = computed(() =>
    this.boardPermissionsService.hasRole(this.boardId(), 'admin')
  );

  readonly cardMembers = rxResource<UserResponseDto[] | null, CardMembersParams>({
    params: () => ({
      cardId: this.cardId(),
      boardId: this.boardId()
    }),
    stream: ({ params }) => {
      if(params.boardId == null || params.cardId == null) return of(null);
      return this.cardMembersService.findCardAssignments(params.boardId, params.cardId);
    },
    defaultValue: null
  });

  readonly totalPages = computed(() =>
    Math.ceil((this.cardMembers.value()?.length ?? 0) / this.pageSize())
  );

  readonly paginatedMembers = computed(() => {
    const members = this.cardMembers.value() ?? [];
    const start = this.currentPage() * this.pageSize();
    return members.slice(start, start + this.pageSize());
  });

  nextPage() { this.currentPage.update(p => p + 1); }
  prevPage() { this.currentPage.update(p => p - 1); }

  readonly columns = computed<ColumnDef<UserResponseDto>[]>(() => {
    const isDeleting = this.isDeleting();
    const canRemove = this.canRemoveMember();
    const userId = this.userId();

    const base: ColumnDef<UserResponseDto>[] = [
      {
        id: 'avatar',
        header: '',
        cell: (info) => {
          const avatarUrl = info.row.original.profile?.avatar;
          const name = info.row.original.profile?.name ?? 'U';

          if (avatarUrl) {
            return `<img src="${avatarUrl}" alt="${name}" class="h-8 w-8 rounded-full object-cover" />`;
          }
          return `
            <span class="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium uppercase">
              ${name[0]}
            </span>
          `;
        },
      },
      {
        accessorKey: 'profile.name',
        header: 'Name',
        cell: (info) =>
          `<span class="block max-w-36 truncate font-medium sm:max-w-52">
            ${info.getValue<string>()}
          </span>`,
      },
    ];

    if (!canRemove) return base;

    return [
      ...base,
      {
        id: 'actions',
        header: 'Remove',
        cell: (info) => {
          const memberId = info.row.original.id!;

          if (userId && memberId === userId) return '';

          return flexRenderComponent(RemoveCardMemberButton, {
            inputs: { memberId, isDeleting },
            outputs: {
              remove: (id: number) => this.onRemoveMember(id)
            }
          });
        },
      },
    ];
  });

  readonly table = createAngularTable<UserResponseDto>(() => ({
    data: this.paginatedMembers(),
    columns: this.columns(),
    getCoreRowModel: getCoreRowModel(),
  }));

  onRemoveMember(memberId: number) {
    this.isDeleting.set(true);

    const boardId = this.boardId();
    const cardId = this.cardId();

    if(boardId == null || cardId == null || memberId == null) {
      toast.error("Something went wrong, invalid data");
      this.isDeleting.set(false);
      return;
    }

    this.cardMembersService.deleteCardAssignment(boardId, cardId, memberId)
    .pipe(finalize(() => {
      this.isDeleting.set(false);
    }))
    .subscribe({
      next: () => {
        toast.success("Card member removed");
        this.cardMembers.reload();
      }
    });

  }
}
