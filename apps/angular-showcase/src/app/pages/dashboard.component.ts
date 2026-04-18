import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SliderModule } from 'primeng/slider';

/* ── Types ── */
interface Option { label: string; value: string; }

/* ── Data ── */
const MONTHS: Option[] = Array.from({ length: 12 }, (_, i) => {
  const v = String(i + 1).padStart(2, '0');
  return { label: v, value: v };
});
const YEARS: Option[] = [2024, 2025, 2026, 2027, 2028, 2029].map(y => ({
  label: String(y), value: String(y),
}));

@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    ToggleSwitchModule,
    TextareaModule,
    CheckboxModule,
    RadioButtonModule,
    SliderModule,
  ],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

      <!-- ═══════ Column 0 — Payment Method ═══════ -->
      <div class="flex flex-col gap-6">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Payment Method</h3>
            <p class="card-desc">All transactions are secure and encrypted.</p>
          </div>
          <div class="card-body space-y-4">

            <!-- Payment type toggles -->
            <div class="grid grid-cols-3 gap-4">
              @for (m of paymentMethods; track m.value) {
                <button
                  class="payment-selector"
                  [class.selected]="paymentMethod() === m.value"
                  (click)="paymentMethod.set(m.value)"
                >
                  @if (m.value === 'card') { <i class="pi pi-credit-card text-lg"></i> }
                  @if (m.value === 'paypal') {
                    <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/>
                    </svg>
                  }
                  @if (m.value === 'apple') { <i class="pi pi-apple text-lg"></i> }
                  <span class="text-xs">{{ m.label }}</span>
                </button>
              }
            </div>

            <!-- Name on Card -->
            <div class="space-y-2">
              <label class="field-label">Name on Card</label>
              <input pInputText placeholder="John Doe" class="w-full" />
            </div>

            <!-- Card Number + CVV -->
            <div class="grid grid-cols-4 gap-4">
              <div class="col-span-3 space-y-2">
                <label class="field-label">Card Number</label>
                <input pInputText placeholder="1234 5678 9012 3456" class="w-full" />
              </div>
              <div class="space-y-2">
                <label class="field-label">CVV</label>
                <input pInputText placeholder="123" class="w-full" />
              </div>
            </div>
            <p class="text-xs text-[hsl(var(--muted-foreground))]">Enter your 16-digit number.</p>

            <!-- Month + Year -->
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="field-label">Month</label>
                <p-select [options]="months" placeholder="MM" optionLabel="label" optionValue="value" styleClass="w-full" />
              </div>
              <div class="space-y-2">
                <label class="field-label">Year</label>
                <p-select [options]="years" placeholder="YYYY" optionLabel="label" optionValue="value" styleClass="w-full" />
              </div>
            </div>

            <!-- Separator -->
            <div class="separator-h"></div>

            <!-- Billing Address -->
            <div class="space-y-2">
              <p class="text-sm font-medium text-[hsl(var(--foreground))]">Billing Address</p>
              <p class="text-xs text-[hsl(var(--muted-foreground))]">The billing address associated with your payment method.</p>
              <div class="flex items-center space-x-2 pt-1">
                <p-checkbox [binary]="true" [(ngModel)]="shippingSame" inputId="same-address" />
                <label for="same-address" class="text-sm font-normal text-[hsl(var(--foreground))]">Same as shipping address</label>
              </div>
            </div>

            <!-- Separator -->
            <div class="separator-h"></div>

            <!-- Comments -->
            <div class="space-y-2">
              <label class="field-label">Comments</label>
              <textarea pTextarea placeholder="Add any additional comments" class="w-full" [rows]="3"></textarea>
            </div>
          </div>

          <div class="card-footer flex gap-2">
            <button pButton label="Submit" class="flex-1 primary-btn"></button>
            <button pButton label="Cancel" [outlined]="true" class="flex-1 outline-btn"></button>
          </div>
        </div>
      </div>

      <!-- ═══════ Column 1 — Team, Badges, Message, Price, Bottom Stack ═══════ -->
      <div class="flex flex-col gap-6">

        <!-- No Team Members -->
        <div class="card">
          <div class="card-body flex flex-col items-center text-center">
            <div class="flex -space-x-3 mb-4">
              <div class="avatar border-2 border-[hsl(var(--background))]">CN</div>
              <div class="avatar border-2 border-[hsl(var(--background))]">LR</div>
              <div class="avatar border-2 border-[hsl(var(--background))]">ER</div>
            </div>
            <p class="text-sm font-semibold mb-1 text-[hsl(var(--foreground))]">No Team Members</p>
            <p class="text-xs mb-4 text-[hsl(var(--muted-foreground))]">Invite your team to collaborate on this project.</p>
            <button pButton label="Invite Members" icon="pi pi-plus" [outlined]="true" size="small" class="outline-btn"></button>
          </div>
        </div>

        <!-- Status Badges -->
        <div class="small-card flex flex-wrap gap-2">
          <span class="badge-outline">
            <span class="h-2 w-2 rounded-full bg-[hsl(var(--primary))] animate-pulse"></span>
            Syncing
          </span>
          <span class="badge-outline">
            <span class="h-2 w-2 rounded-full bg-[hsl(var(--primary))] animate-pulse"></span>
            Updating
          </span>
          <span class="badge-outline">
            <span class="h-2 w-2 rounded-full bg-[hsl(var(--primary))] animate-pulse"></span>
            Loading
          </span>
        </div>

        <!-- Send Message -->
        <div class="small-card !p-2">
          <div class="flex items-center gap-2">
            <button pButton icon="pi pi-plus" [text]="true" size="small" class="ghost-btn shrink-0 !h-8 !w-8"></button>
            <input pInputText placeholder="Send a message..." class="flex-1 msg-input" />
            <button pButton icon="pi pi-microphone" [text]="true" size="small" class="ghost-btn shrink-0 !h-8 !w-8"></button>
          </div>
        </div>

        <!-- Price Range -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Price Range</h3>
            <p class="text-xs text-[hsl(var(--muted-foreground))]">Set your budget range ({{ '$' + sliderRange()[0] }} - {{ sliderRange()[1] }}).</p>
          </div>
          <div class="card-body">
            <p-slider [ngModel]="sliderRange()" (ngModelChange)="sliderRange.set($event)" [range]="true" [min]="0" [max]="1000" [step]="10" styleClass="w-full" />
          </div>
        </div>

        <!-- Bottom Stack -->
        <div class="card">
          <div class="card-body space-y-3">

            <!-- Search input -->
            <div class="flex items-center gap-2">
              <div class="relative flex-1">
                <i class="pi pi-search absolute left-2.5 top-2.5 text-sm text-[hsl(var(--muted-foreground))]"></i>
                <input pInputText placeholder="Search..." class="w-full h-9 pl-8 text-sm" />
              </div>
              <span class="text-xs text-[hsl(var(--muted-foreground))] whitespace-nowrap">12 results</span>
            </div>

            <!-- URL input -->
            <div class="flex items-center rounded-md border border-[hsl(var(--border))]">
              <span class="px-3 text-sm text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))] border-r border-[hsl(var(--border))] rounded-l-md py-1.5">https://</span>
              <input pInputText placeholder="example.com" class="flex-1 url-input" />
              <i class="pi pi-info-circle text-sm text-[hsl(var(--muted-foreground))] mr-2.5 shrink-0"></i>
            </div>

            <!-- AI chat input -->
            <input pInputText placeholder="Ask, Search or Chat..." class="w-full h-9 text-sm" />

            <!-- Auto / usage row -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]">
                <i class="pi pi-plus text-xs"></i>
                <span>Auto</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs text-[hsl(var(--muted-foreground))]">52% used</span>
                <button pButton icon="pi pi-arrow-up" class="primary-btn !h-7 !w-7 !rounded-full"></button>
              </div>
            </div>

            <!-- Username input -->
            <div class="relative">
              <input pInputText value="&#64;shadcn" class="w-full h-9 pr-8 text-sm" />
              <i class="pi pi-check-circle absolute right-2.5 top-2.5 text-sm" style="color: #22c55e;"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══════ Column 2 — Browser, Auth, Appearance, Compute ═══════ -->
      <div class="flex flex-col gap-6">

        <!-- Browser URL bar -->
        <div class="small-card">
          <div class="flex items-center gap-2">
            <i class="pi pi-globe text-sm text-[hsl(var(--muted-foreground))] shrink-0"></i>
            <span class="text-sm text-[hsl(var(--muted-foreground))]">https://</span>
            <span class="flex-1"></span>
            <i class="pi pi-star text-sm text-[hsl(var(--muted-foreground))] shrink-0"></i>
          </div>
        </div>

        <!-- Auth + Profile -->
        <div class="card">
          <div class="card-body space-y-3">
            <div class="flex items-start justify-between gap-4">
              <div class="space-y-1">
                <p class="text-sm font-medium text-[hsl(var(--foreground))]">Two-factor authentication</p>
                <p class="text-xs text-[hsl(var(--muted-foreground))]">Verify via email or phone number.</p>
              </div>
              <button pButton label="Enable" [outlined]="true" size="small" class="outline-btn shrink-0"></button>
            </div>
            <div class="separator-h"></div>
            <div class="flex items-center gap-3">
              <i class="pi pi-check-circle text-sm shrink-0" style="color: #22c55e;"></i>
              <span class="text-sm flex-1 text-[hsl(var(--foreground))]">Your profile has been verified.</span>
              <i class="pi pi-chevron-right text-sm text-[hsl(var(--muted-foreground))] shrink-0"></i>
            </div>
          </div>
        </div>

        <!-- Appearance Settings -->
        <div class="small-card">
          <p class="text-sm font-medium text-[hsl(var(--foreground))]">Appearance Settings</p>
        </div>

        <!-- Compute Environment + GPU + Wallpaper -->
        <div class="card">
          <div class="card-body space-y-4">

            <!-- Compute Environment -->
            <div class="space-y-1">
              <p class="text-sm font-medium text-[hsl(var(--foreground))]">Compute Environment</p>
              <p class="text-xs text-[hsl(var(--muted-foreground))]">Select the compute environment for your cluster.</p>
            </div>

            <div class="space-y-3">
              <div class="flex items-start space-x-3 rounded-md border border-[hsl(var(--primary))] p-3">
                <p-radioButton name="compute" value="kubernetes" [(ngModel)]="computeEnv" inputId="k8s" />
                <div>
                  <label for="k8s" class="text-sm font-medium text-[hsl(var(--foreground))]">Kubernetes</label>
                  <p class="text-xs text-[hsl(var(--muted-foreground))]">Run GPU workloads on a K8s configured cluster. This is the default.</p>
                </div>
              </div>
              <div class="flex items-start space-x-3 rounded-md border border-[hsl(var(--border))] p-3 opacity-50">
                <p-radioButton name="compute" value="vm" [(ngModel)]="computeEnv" inputId="vm" [disabled]="true" />
                <div>
                  <label for="vm" class="text-sm font-medium text-[hsl(var(--foreground))]">Virtual Machine</label>
                  <p class="text-xs text-[hsl(var(--muted-foreground))]">Access a VM configured cluster to run workloads. (Coming soon)</p>
                </div>
              </div>
            </div>

            <div class="separator-h"></div>

            <!-- Number of GPUs -->
            <div class="space-y-1">
              <p class="text-sm font-medium text-[hsl(var(--foreground))]">Number of GPUs</p>
              <p class="text-xs text-[hsl(var(--muted-foreground))]">You can add more later.</p>
            </div>
            <div class="flex items-center justify-center gap-4">
              <button pButton icon="pi pi-minus" [outlined]="true" size="small" class="outline-btn !h-8 !w-8"
                (click)="gpuCount.set(Math.max(0, gpuCount() - 1))"></button>
              <span class="w-8 text-center text-lg font-semibold tabular-nums text-[hsl(var(--foreground))]">{{ gpuCount() }}</span>
              <button pButton icon="pi pi-plus" [outlined]="true" size="small" class="outline-btn !h-8 !w-8"
                (click)="gpuCount.set(gpuCount() + 1)"></button>
            </div>

            <div class="separator-h"></div>

            <!-- Wallpaper Tinting -->
            <div class="flex items-center justify-between gap-4">
              <div class="space-y-0.5">
                <p class="text-sm font-medium text-[hsl(var(--foreground))]">Wallpaper Tinting</p>
                <p class="text-xs text-[hsl(var(--muted-foreground))]">Allow the wallpaper to be tinted.</p>
              </div>
              <p-toggleswitch [(ngModel)]="wallpaperTinting" />
            </div>
          </div>
        </div>
      </div>

      <!-- ═══════ Column 3 — xl only ═══════ -->
      <div class="hidden xl:flex flex-col gap-6">

        <!-- Prompt / Context -->
        <div class="card">
          <div class="card-body space-y-3">
            <div class="flex items-center gap-2">
              <i class="pi pi-sparkles text-sm text-[hsl(var(--muted-foreground))]"></i>
              <button pButton label="Add context" [outlined]="true" size="small" class="outline-btn !text-xs"></button>
            </div>
            <input pInputText placeholder="Ask, search, or make anything..." class="w-full h-9 text-sm" />
            <div class="separator-h"></div>
            <div class="flex items-center gap-2">
              <i class="pi pi-paperclip text-sm text-[hsl(var(--muted-foreground))] shrink-0"></i>
              <span class="text-xs text-[hsl(var(--muted-foreground))]">Auto</span>
              <div class="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]">
                <i class="pi pi-globe text-xs"></i>
                <span>All Sources</span>
              </div>
              <span class="flex-1"></span>
              <button pButton icon="pi pi-arrow-up" class="primary-btn !h-7 !w-7 !rounded-full"></button>
            </div>
          </div>
        </div>

        <!-- Actions bar -->
        <div class="small-card !p-2">
          <div class="flex items-center gap-1">
            <button pButton icon="pi pi-chevron-left" [text]="true" size="small" class="ghost-btn !h-8 !w-8"></button>
            <button pButton label="Archive" [text]="true" size="small" class="ghost-btn !h-8 !text-xs"></button>
            <button pButton label="Report" [text]="true" size="small" class="ghost-btn !h-8 !text-xs"></button>
            <button pButton label="Snooze" [text]="true" size="small" class="ghost-btn !h-8 !text-xs"></button>
            <button pButton icon="pi pi-ellipsis-h" [text]="true" size="small" class="ghost-btn !h-8 !w-8"></button>
          </div>
        </div>

        <!-- Terms -->
        <div class="small-card">
          <div class="flex items-center space-x-2">
            <p-checkbox [binary]="true" [(ngModel)]="termsAgreed" inputId="terms" />
            <label for="terms" class="text-sm font-normal leading-snug text-[hsl(var(--foreground))]">I agree to the terms and conditions</label>
          </div>
        </div>

        <!-- Pagination + Copilot -->
        <div class="small-card !p-2">
          <div class="flex items-center gap-1">
            @for (n of [1, 2, 3]; track n) {
              <button pButton [label]="'' + n" size="small"
                [class]="n === 1 ? 'primary-btn !h-8 !w-8 !text-xs' : 'ghost-btn !h-8 !w-8 !text-xs'"
                [text]="n !== 1">
              </button>
            }
            <button pButton icon="pi pi-chevron-left" [text]="true" size="small" class="ghost-btn !h-8 !w-8"></button>
            <button pButton icon="pi pi-chevron-right" [text]="true" size="small" class="ghost-btn !h-8 !w-8"></button>
            <span class="flex-1"></span>
            <i class="pi pi-sparkles text-sm text-[hsl(var(--muted-foreground))]"></i>
            <button pButton label="Copilot" icon="pi pi-chevron-down" iconPos="right" [outlined]="true" size="small" class="outline-btn !h-8 !text-xs !gap-1"></button>
          </div>
        </div>

        <!-- Survey -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title" style="font-size:0.875rem">How did you hear about us?</h3>
            <p class="card-desc" style="font-size:0.75rem">Select the option that best describes how you found us.</p>
          </div>
          <div class="card-body">
            <div class="grid grid-cols-2 gap-2">
              @for (opt of surveyOptions; track opt.value) {
                <button
                  class="survey-btn"
                  [class.survey-active]="surveyAnswer() === opt.value"
                  (click)="surveyAnswer.set(opt.value)"
                >{{ opt.label }}</button>
              }
            </div>
          </div>
        </div>

        <!-- Processing spinner -->
        <div class="card">
          <div class="card-body flex flex-col items-center text-center space-y-4">
            <i class="pi pi-spinner pi-spin text-[hsl(var(--muted-foreground))]" style="font-size: 2.5rem;"></i>
            <div class="space-y-1">
              <p class="text-sm font-medium text-[hsl(var(--foreground))]">Processing your request</p>
              <p class="text-xs text-[hsl(var(--muted-foreground))]">Please wait while we process your request. Do not refresh the page.</p>
            </div>
            <button pButton label="Cancel" [outlined]="true" size="small" class="outline-btn !text-xs"></button>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; }

    /* ── Card ── */
    .card {
      border-radius: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding-top: 1rem;
      padding-bottom: 1rem;
      overflow: hidden;
      background: hsl(var(--card));
      color: hsl(var(--card-foreground));
      box-shadow: inset 0 0 0 1px hsl(var(--foreground) / 0.1);
    }

    /* ── Card header ── */
    .card-header {
      display: grid;
      grid-auto-rows: min-content;
      gap: 0.25rem;
      padding: 0 1rem;
    }
    .card-title {
      font-size: 1rem;
      font-weight: 500;
      line-height: 1.375;
      color: hsl(var(--foreground));
      margin: 0;
    }
    .card-desc {
      font-size: 0.875rem;
      color: hsl(var(--muted-foreground));
      margin: 0;
    }

    /* ── Card body (= CardContent) ── */
    .card-body {
      padding: 0 1rem;
    }

    /* ── Card footer ── */
    .card-footer {
      display: flex;
      align-items: center;
      padding: 1rem;
      border-top: 1px solid hsl(var(--border));
      background: hsl(var(--muted) / 0.5);
      border-radius: 0 0 0.75rem 0.75rem;
    }
    .card:has(.card-footer) { padding-bottom: 0; }

    /* ── Small card / row ── */
    .small-card {
      border-radius: 0.5rem;
      border: 1px solid hsl(var(--border));
      background: hsl(var(--card));
      padding: 0.75rem;
    }

    /* ── Avatar ── */
    .avatar {
      display: flex;
      width: 2.5rem;
      height: 2.5rem;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      border-radius: 9999px;
      background: hsl(var(--muted));
      color: hsl(var(--foreground));
      font-size: 0.75rem;
      font-weight: 500;
    }

    /* ── Badge outline ── */
    .badge-outline {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      border-radius: 9999px;
      border: 1px solid hsl(var(--border));
      padding: 0.125rem 0.625rem;
      font-size: 0.75rem;
      font-weight: 500;
      color: hsl(var(--foreground));
    }

    /* ── Field label ── */
    .field-label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: hsl(var(--foreground));
    }

    /* ── Payment selector ── */
    .payment-selector {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 0.75rem 0;
      border-radius: calc(0.5rem - 2px);
      border: 1px solid hsl(var(--border));
      background: transparent;
      color: hsl(var(--foreground));
      cursor: pointer;
      transition: border-color 0.15s, background 0.15s;
    }
    .payment-selector:hover:not(.selected) {
      background: hsl(var(--muted) / 0.5);
    }
    .payment-selector.selected {
      border-color: hsl(var(--primary));
    }

    /* ── Separator horizontal ── */
    .separator-h {
      height: 1px;
      background: hsl(var(--border));
    }

    /* ── Survey toggle buttons ── */
    .survey-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 2.25rem;
      border-radius: 0.375rem;
      border: 1px solid hsl(var(--border));
      background: transparent;
      color: hsl(var(--foreground));
      font-size: 0.75rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.15s, color 0.15s, border-color 0.15s;
    }
    .survey-btn:hover:not(.survey-active) {
      background: hsl(var(--muted) / 0.5);
    }
    .survey-btn.survey-active {
      background: hsl(var(--primary));
      color: hsl(var(--primary-foreground));
      border-color: hsl(var(--primary));
    }

    /* ── URL input override ── */
    :host ::ng-deep .url-input.p-inputtext {
      border: none !important;
      box-shadow: none !important;
      border-radius: 0 0.375rem 0.375rem 0;
      height: auto;
      padding-top: 0.375rem;
      padding-bottom: 0.375rem;
      font-size: 0.875rem;
    }

    /* ── Message input override ── */
    :host ::ng-deep .msg-input.p-inputtext {
      height: 2rem;
      font-size: 0.875rem;
      border: 0 !important;
      box-shadow: none !important;
    }

    /* ── PrimeNG button variants ── */
    :host ::ng-deep .primary-btn.p-button {
      background: hsl(var(--primary));
      color: hsl(var(--primary-foreground));
      border-color: hsl(var(--primary));
    }
    :host ::ng-deep .primary-btn.p-button:hover {
      background: hsl(var(--primary) / 0.9);
      border-color: hsl(var(--primary) / 0.9);
    }

    :host ::ng-deep .outline-btn.p-button {
      background: transparent;
      color: hsl(var(--foreground));
      border-color: hsl(var(--border));
    }
    :host ::ng-deep .outline-btn.p-button:hover {
      background: hsl(var(--muted) / 0.5);
    }

    :host ::ng-deep .ghost-btn.p-button {
      background: transparent;
      color: hsl(var(--foreground));
      border-color: transparent;
    }
    :host ::ng-deep .ghost-btn.p-button:hover {
      background: hsl(var(--muted) / 0.5);
    }
  `],
})
export class DashboardComponent {
  readonly Math = Math;

  /* ── State (signals) ── */
  readonly paymentMethod = signal<string>('card');
  readonly termsAgreed = signal(true);
  readonly computeEnv = signal('kubernetes');
  readonly gpuCount = signal(8);
  readonly wallpaperTinting = signal(false);
  readonly surveyAnswer = signal('social');
  readonly sliderRange = signal([200, 800]);
  readonly shippingSame = signal(true);

  /* ── Static data ── */
  readonly paymentMethods = [
    { value: 'card', label: 'Card' },
    { value: 'paypal', label: 'Paypal' },
    { value: 'apple', label: 'Apple' },
  ];
  readonly months = MONTHS;
  readonly years = YEARS;
  readonly surveyOptions = [
    { label: 'Social Media', value: 'social' },
    { label: 'Search Engine', value: 'search' },
    { label: 'Referral', value: 'referral' },
    { label: 'Other', value: 'other' },
  ];
}
